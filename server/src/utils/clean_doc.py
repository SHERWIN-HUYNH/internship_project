from bson import ObjectId
import numpy as np
from datetime import datetime

def clean_doc(doc):
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, np.generic):
        return doc.item()
    if isinstance(doc, datetime):
        return doc.isoformat()
    if isinstance(doc, dict):
        return {k: clean_doc(v) for k, v in doc.items()}
    if isinstance(doc, list):
        return [clean_doc(v) for v in doc]
    return doc
