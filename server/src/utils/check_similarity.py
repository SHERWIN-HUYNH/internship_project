from datetime import datetime
from difflib import SequenceMatcher
import unicodedata
import re
import numpy as np

WEIGHT_NAME   = 0.35
WEIGHT_DOB    = 0.20
WEIGHT_GENDER = 0.15
WEIGHT_IMG    = 0.30
SCORE_THRESH  = 0.60     # tổng điểm tối thiểu để đưa vào suspect
TOPK_SUSPECTS = 10
MAX_IMAGES    = 5

def _strip_accents_lower(text: str) -> str:
    if not text:
        return ""
    # Chuẩn hoá NFD và bỏ dấu
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.lower()
    # Bỏ ký tự không phải chữ/số
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    # Thu gọn khoảng trắng
    return re.sub(r"\s+", " ", text).strip()

def _name_similarity(a: str | None, b: str | None) -> float:
    a_n = _strip_accents_lower(a or "")
    b_n = _strip_accents_lower(b or "")
    if not a_n or not b_n:
        return 0.0
    return float(SequenceMatcher(None, a_n, b_n).ratio())

def _dob_similarity(dob1, dob2):
    # Convert to string if datetime
    dob1_str = dob1.strftime('%Y-%m-%d') if isinstance(dob1, datetime) else dob1
    dob2_str = dob2.strftime('%Y-%m-%d') if isinstance(dob2, datetime) else dob2
    try:
        d1 = datetime.strptime(dob1_str, '%Y-%m-%d')
        d2 = datetime.strptime(dob2_str, '%Y-%m-%d')
        delta = abs((d1 - d2).days)
        return 1.0 / (1.0 + delta / 365.25)  # Example similarity score
    except ValueError:
        return 0.0

def _gender_similarity(a: str | None, b: str | None) -> float:
    if not a or not b:
        return 0.0
    return 1.0 if str(a).strip().lower() == str(b).strip().lower() else 0.0

def _weighted_score(name_s, dob_s, gender_s, img_s) -> float:
    # Chuẩn hoá theo tổng trọng số của các thành phần có mặt (không phạt khi field thiếu)
    parts = []
    weights = []
    if name_s is not None:
        parts.append(name_s); weights.append(WEIGHT_NAME)
    if dob_s is not None:
        parts.append(dob_s); weights.append(WEIGHT_DOB)
    if gender_s is not None:
        parts.append(gender_s); weights.append(WEIGHT_GENDER)
    if img_s is not None:
        parts.append(img_s); weights.append(WEIGHT_IMG)
    if not parts:
        return 0.0
    wsum = sum(weights)
    return float(sum(p*w for p, w in zip(parts, weights)) / (wsum if wsum > 0 else 1.0))
def _img_score_from_l2(min_l2: float | None, l2_threshold: float) -> float:
    # Quy đổi L2 (càng nhỏ càng giống) sang điểm [0..1] theo ngưỡng
    if min_l2 is None:
        return 0.0
    if min_l2 >= l2_threshold:
        return 0.0
    return float(1.0 - (min_l2 / l2_threshold))
def _min_l2_to_post_embeddings(this_post_embeds: list[np.ndarray], other_post_embeds: list[list[float]]) -> float | None:
    if not this_post_embeds or not other_post_embeds:
        return None
    other = [np.array(v, dtype=np.float32) for v in other_post_embeds]
    min_d = None
    for e in this_post_embeds:
        for o in other:
            d = float(np.sum((e - o) ** 2))
            min_d = d if (min_d is None or d < min_d) else min_d
    return min_d