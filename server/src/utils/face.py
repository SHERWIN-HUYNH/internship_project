from functools import partial
import os

from ..utils.exceptions import DetectFaceError
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from mtcnn.mtcnn import MTCNN
from keras_facenet import FaceNet
from PIL import Image, ImageEnhance
from concurrent.futures import ProcessPoolExecutor
from multiprocessing import shared_memory
from io import BytesIO
import cv2 as cv
import numpy as np
import logging


logger = logging.getLogger("face")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter(
    "%(asctime)s %(name)s [%(levelname)s]: %(message)s"
)
handler.setFormatter(formatter)
logger.addHandler(handler)

class FaceDetect:
    def __init__(self, target_size=(160, 160)):
        self.target_size = target_size
        self.X, self.Y = [], []
        self.detector = MTCNN()


    def extract_face(self, img: np.ndarray) -> np.ndarray:
        faces = self.detector.detect_faces(img)
        if len(faces) != 1:
            return None

        x, y, w, h = faces[0]['box']
        x, y = abs(x), abs(y)
        face = img[y:y+h, x:x+w]
        # Resize to target size
        face_resized = cv.resize(face, self.target_size)
        return face_resized


class FaceVerify:
    def __init__(self):
        self.model = FaceNet().model


    def get_embedding(self, face_resized: np.ndarray) -> np.ndarray:
        x = face_resized.astype('float32') / 127.5 - 1.0
        embedding = self.model.predict(np.expand_dims(x, axis=0), verbose=0)
        return embedding[0]


face_detect = FaceDetect()
face_verify = FaceVerify()


def enhance_image(img):
    sharpness = ImageEnhance.Sharpness(img)
    img_ = sharpness.enhance(2.0)
    contrast = ImageEnhance.Contrast(img_)
    img_ = contrast.enhance(1.5)
    if len(np.array(img_).shape) == 2:
        img_ = cv.cvtColor(np.array(img_), cv.COLOR_GRAY2RGB)
    img_ = cv.fastNlMeansDenoisingColored(np.array(img_), None, h=3, hColor=3, templateWindowSize=7, searchWindowSize=21)
    # Save for debugging
    cv.imwrite("debug_enhanced.jpg", img_)
    return img_


def img_to_embedding(stream: BytesIO) -> np.ndarray:
    img = Image.open(stream)
    enhanced_img = enhance_image(img)
    face = face_detect.extract_face(enhanced_img)
    logger.info(f"Face detected: {face is not None}")
    if face is None:
        raise DetectFaceError("No face detected")
    return face_verify.get_embedding(face)


# Global variables for workers
_embedding_shape = None
_embedding_dtype = None
_embedding_shm = None


# def _init_worker(shm_name, shape, dtype):
#     global _embedding
#     shm = shared_memory.SharedMemory(name=shm_name)
#     _embedding = np.ndarray(shape, dtype=dtype, buffer=shm.buf)

# def _get_sim_score_of_embed(other_img: dict) -> dict:
#     global _embedding
#     feature = np.array(other_img['feature'], dtype=np.float32)
#     l2_score = np.linalg.norm(_embedding - feature)
#     return {'l2_score': l2_score, '_id': other_img['_id'], 'post._id': other_img['post']['_id']}

# def get_score_of_img_to_imgs(img_embed: np.ndarray, other_imgs_embed: list[dict]):
#     # Create shared memory for img_embed
#     shm = shared_memory.SharedMemory(create=True, size=img_embed.nbytes)
#     shm_arr = np.ndarray(img_embed.shape, dtype=img_embed.dtype, buffer=shm.buf)
#     shm_arr[:] = img_embed[:]
    
#     try:
#         with ProcessPoolExecutor(initializer=_init_worker, initargs=(shm.name, img_embed.shape, img_embed.dtype)) as executor:
#             l2_imgs_score = list(executor.map(_get_sim_score_of_embed, other_imgs_embed))
#         logger.info(f'L2 scores: {[s["l2_score"] for s in l2_imgs_score]}')
#         return sorted(l2_imgs_score, key=lambda i: i['l2_score'])
#     finally:
#         shm.close()
#         shm.unlink()
def _init_worker(shm_name, shape, dtype):
    """Initialize worker with access to the shared embedding array."""
    global _embedding_shm, _embedding_shape, _embedding_dtype, _embedding

    _embedding_shape = shape
    _embedding_dtype = np.dtype(dtype)
    _embedding_shm = shared_memory.SharedMemory(name=shm_name)

    _embedding = np.ndarray(shape, dtype=np.dtype(dtype), buffer=_embedding_shm.buf)


def _get_sim_score_of_embed(img_embed: np.ndarray, other_img: dict) -> dict:
    feature = np.array(other_img['feature'], dtype=np.float32)
    l2_score = np.linalg.norm(img_embed - feature)
    return {
        'l2_score': l2_score,
        '_id': other_img['_id'],
        'post_id': other_img['post']['_id']  # Use post_id instead of post._id
    }
    

def get_score_of_img_to_imgs(img_embed: np.ndarray, other_imgs_embed: list[dict]):
    l2_imgs_score = list(map(partial(_get_sim_score_of_embed, img_embed), other_imgs_embed))
    logger.info(f'l2 score\n{l2_imgs_score}')
    return sorted(l2_imgs_score, key=lambda i: i['l2_score'])

