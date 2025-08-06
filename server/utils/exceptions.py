'''accounts'''

class NonExistAccount(Exception):
    def __init__(self, account_detail: str, status_code=400):
        self.message = f'This account does not exist' if account_detail == '' else f'This account does not exist, detail: {account_detail}'
        super().__init__(self.message)
        self.status_code = status_code

'''posts'''

class InvalidDate(Exception):
    def __init__(self, input_date: str, status_code=400):
        self.message = f'Invalid date format, correct format is "dd/mm/yyyy HH:MM:SS" and date must be in the past'
        super().__init__(self.message)
        self.status_code = status_code

'''images'''

class NoImageProvide(Exception):
    def __init__(self, post_id, status_code=400):
        self.message = f'Please provide image for post'
        super().__init__(self.message)
        self.status_code = status_code

'''requests'''

class ParamError(Exception):
    def __init__(self, msg: str, status_code=400):
        super().__init__(self.message)
        self.message = msg
        self.status_code = status_code

class MissingFields(Exception):
    def __init__(self, required_fields: list[int], status_code=400):
        self.message = f'Missing fields, the required must include: {required_fields}'
        super().__init__(self.message)
        self.status_code = status_code


class InvalidFieldType(Exception):
    def __init__(self, required_fields: list[int], type, status_code=400):
        self.message = f'Invalid field type, {type} must required for these fields: {required_fields}'
        super().__init__(self.message)
        self.status_code = status_code



