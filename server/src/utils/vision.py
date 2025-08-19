import numpy as np

def img_to_embedding(stream) -> np.ndarray | None:
    """
    Convert image stream (e.g. BytesIO) into embedding vector.
    Trả về None nếu không nhận diện được.
    """
    # TODO: Tùy chỉnh theo cách bạn trích xuất embedding từ ảnh
    # Giả sử ta chỉ trả về vector ngẫu nhiên để minh hoạ
    embedding = np.random.rand(128)  # ví dụ: embedding 128 chiều
    return embedding

def get_score_of_img_to_imgs(query_embedding, imgs_cursor) -> list:
    """
    Tính khoảng cách Euclidean giữa ảnh đầu vào và danh sách ảnh đã lưu.
    """
    results = []
    for img in imgs_cursor:
        db_embedding = np.array(img.get("feature"))
        l2_score = np.linalg.norm(query_embedding - db_embedding)
        results.append({
            "l2_score": round(float(l2_score), 4),
            "_id": img["_id"],
            "post_id": img["post._id"]
        })
    return results
