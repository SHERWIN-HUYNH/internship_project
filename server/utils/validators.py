from datetime import datetime

def missing_fields_validate(check_fields:dict, target_fields:list):
    return all(k in target_fields for k in check_fields.keys())

def fields_type_validate(check_fields:dict, target_fields:list, type):
    return all(isinstance(check_fields[k], type) for k in target_fields)

def date_validate(date: str):
    if date is None: return 'n/a'
    try:
        date_ = datetime.strptime(date, '%d/%m/Y')
    except ValueError:
        try:
            date_ = datetime.strptime(date, '%d/%m/Y %H:%M:%S')
        except ValueError:
            return None
    return None if date_ > datetime.now() else date_

    