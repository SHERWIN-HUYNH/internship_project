import re
from datetime import datetime
from typing import Optional
from ..utils.exceptions import InvalidDate, MissingFields
from datetime import datetime

def date_validate(date_str: str, format: str = "%Y-%m-%d") -> datetime | None:
    """
    Convert date string to datetime object if valid, else return None.
    Default format is 'YYYY-MM-DD'.
    """
    try:
        return datetime.strptime(date_str, format)
    except (ValueError, TypeError):
        return None


def validate_required_fields(name: str, contact: str):
    if "" in [name, contact]:
        raise MissingFields("'name' or 'contact_info'")

def validate_name(name: str):
    if re.fullmatch(r"[a-zA-Z ]+", name) is None:
        raise ValueError("Person name accept no special character")

def validate_gender(gender: str):
    if gender not in ["Male", "Female", "M", "F", ""]:
        raise ValueError("Gender only accept 'Male', 'Female', 'M', 'F', ''")

def parse_date_or_empty(label: str, value: str) -> Optional[datetime]:
    if value == "":
        return None
    dt = date_validate(value)
    if dt is None:
        raise InvalidDate(value)
    return dt

def validate_temporal_consistency(dob: Optional[datetime], doe: Optional[datetime]):
    if None not in [dob, doe] and dob > doe:
        raise Exception("date of event must be later than dob")

def build_create_payload(data: dict) -> dict:
    validate_required_fields(data["name"], data["contact_info"])
    # validate_name(data["name"])
    validate_gender(data["gender"])
    dob = parse_date_or_empty("dob", data["dob"])
    doe = parse_date_or_empty("missing_since", data["missing_since"])
    validate_temporal_consistency(dob, doe)

    return {
        "name": data["name"],
        "gender": data["gender"],
        "dob": dob,
        "missing_since": doe,
        "description": data["description"],
        "contact_info": data["contact_info"]
    }

def build_update_payload(data: dict) -> dict:
    validate_required_fields(data["name"], data["contact_info"])
    validate_name(data["name"])
    validate_gender(data["gender"])
    dob = parse_date_or_empty("dob", data["dob"])
    doe = parse_date_or_empty("missing_since", data["missing_since"])
    validate_temporal_consistency(dob, doe)

    return {
        "name": data["name"],
        "gender": data["gender"],
        "dob": dob,
        "missing_since": doe,
        "description": data["description"],
        "contact_info": data["contact_info"]
    }

def build_filter(filter_data: dict) -> dict:
    qc = {}
    if filter_data.get("person_name", "") != "":
        qc["person_name"] = filter_data["person_name"]

    if filter_data.get("gender") in ["M", "F"]:
        qc["gender"] = filter_data["gender"]

    dob_from = date_validate(filter_data.get("dob_from", ""))
    dob_to = date_validate(filter_data.get("dob_to", ""))
    missing_since_from = date_validate(filter_data.get("missing_since_from", ""))
    missing_since_to = date_validate(filter_data.get("missing_since_to", ""))
    create_from = date_validate(filter_data.get("create_from", ""))
    create_to = date_validate(filter_data.get("create_to", ""))

    if None not in [dob_from, dob_to] and dob_from < dob_to:
        qc["dob"] = {"$gte": dob_from, "$lte": dob_to}
    if None not in [missing_since_from, missing_since_to] and missing_since_from < missing_since_to:
        qc["missing_since"] = {"$gte": missing_since_from, "$lte": missing_since_to}
    if None not in [create_from, create_to] and create_from < create_to:
        qc["create_at"] = {"$gte": create_from, "$lte": create_to}

    qc["status"] = "finding"
    return qc
