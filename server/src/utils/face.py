import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from mtcnn.mtcnn import MTCNN
from keras_facenet import FaceNet
from PIL import Image
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
        try:
            faces = self.detector.detect_faces(img)
        except Exception:
            return None
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


def img_to_embedding(stream: BytesIO) -> np.ndarray:
    try:
        img = np.array(Image.open(stream))
        face = face_detect.extract_face(img)
    except ValueError as e:
        logger.exception('Face extraction error')
        return None
    except OSError as e:
        logger.exception('Face extraction error')
        return None
    return face if face is None else face_verify.get_embedding(face)


def _get_sim_score_of_embed(img_dict):
    global _embedding
    img_embed = np.array(img_dict.pop('feature'), dtype=np.float32)    
    # measure_embeddings_similarity
    img_dict['l2_score'] = float(np.sum((img_embed - _embedding)**2))
    return img_dict
    

def get_score_of_img_to_imgs(img_embed: np.ndarray, other_imgs_embed: list[dict]):
    global _embedding
    _embedding = img_embed

    l2_imgs_score = list(map(_get_sim_score_of_embed, other_imgs_embed))
    logger.info(l2_imgs_score)
    return sorted(l2_imgs_score, key=lambda i: i['l2_score'])