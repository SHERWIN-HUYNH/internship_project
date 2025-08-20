from functools import partial
import os

from ..utils.exceptions import DetectFaceError
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from mtcnn.mtcnn import MTCNN
from keras_facenet import FaceNet
from tensorflow import keras
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
model_path = os.path.join(os.path.dirname(__file__), '/src/utils', 'facenet_model.h5')
class FaceVerify:
    def __init__(self):
        self.model = keras.models.load_model(model_path)


    def get_embedding(self, face_resized: np.ndarray) -> np.ndarray:
        x = face_resized.astype('float32') / 127.5 - 1.0
        embedding = self.model.predict(np.expand_dims(x, axis=0), verbose=0)
        return embedding[0]
