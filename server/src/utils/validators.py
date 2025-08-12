from datetime import datetime

def date_validate(date: str):
    if date is None: return 'n/a'
    try:
        date_ = datetime.strptime(date, '%d/%m/%Y')
    except ValueError:
        try:
            date_ = datetime.strptime(date, '%d/%m/%Y %H:%M:%S')
        except ValueError:
            return None
    return None if date_ > datetime.now() else date_

    