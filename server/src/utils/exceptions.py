'''accounts'''
class InvalidAccountState(Exception):
    def __init__(self, account_id: str, status_code=400):
        self.message = f'State of account {account_id} must be "active" or "disable"'
        super().__init__(self.message)
        self.status_code = status_code

class NonExistAccount(Exception):
    def __init__(self, account_detail: str, status_code=400):
        self.message = f'This account does not exist' if account_detail == '' else f'This account does not exist, detail: {account_detail}'
        super().__init__(self.message)
        self.status_code = status_code

class UnauthorizedAccount(Exception):
    def __init__(self, msg: str, status_code=400):
        self.message = msg
        super().__init__(self.message)
        self.status_code = status_code

'''posts'''

class InvalidDate(Exception):
    def __init__(self, input_date: str, status_code=400):
        self.message = f"Invalid date format: '{input_date}', correct format is 'dd/mm/yyyy HH:MM:SS' and date must be in the past"
        super().__init__(self.message)
        self.status_code = status_code

class PersonNameExisted(Exception):
    def __init__(self, person_name: str, status_code=400):
        self.message = f'Name {person_name} has existed'
        super().__init__(self.message)
        self.status_code = status_code

class NonExistPost(Exception):
    def __init__(self, post_id: str, status_code=400):
        self.message = f'Post {post_id} does not exist'
        super().__init__(self.message)
        self.status_code = status_code

class InvalidFilter(Exception):
    def __init__(self, msg: str, status_code=400):
        self.message = msg
        super().__init__(self.message)
        self.status_code = status_code

class DeletedImagesFailed(Exception):
    def __init__(self, post_id: str, detail, status_code=400):
        self.message = f'Deleted images failed for {post_id}'
        self.detail = detail
        super().__init__(self.message)
        self.status_code = status_code

'''images'''

class NoImageProvide(Exception):
    def __init__(self, status_code=400):
        self.message = f'Please provide image'
        super().__init__(self.message)
        self.status_code = status_code

class FileType(Exception):
    def __init__(self, file_name, accepted_extension, status_code=400):
        self.message = f'File {file_name} is not allow, extension must be {accepted_extension}'
        super().__init__(self.message)
        self.status_code = status_code

class DetectFaceError(Exception):
    def __init__(self, file_name:str, status_code=500):
        self.message = f'System either detect no face or multiple faces detected in {file_name}'
        super().__init__(self.message)
        self.status_code = status_code

class ImageUploadFailed(Exception):
    def __init__(self, file_name, status_code=500):
        self.message = f'Failed to upload image {file_name}'
        super().__init__(self.message)
        self.status_code = status_code

class DifferentImageIdentityError(Exception):
    def __init__(self, filename, status_code=400):
        self.message = f'The system assumed the identity in file: {filename} was not the same as all identities you have provided, choose another one'
        super().__init__(self.message)
        self.status_code = status_code

class EmptyFile(Exception):
    def __init__(self,  status_code=400):
        self.message = f'Uploaded empty file'
        super().__init__(self.message)
        self.status_code = status_code

'''requests'''

class ParamError(Exception):
    def __init__(self, msg: str, status_code=400):
        self.message = msg
        super().__init__(self.message)
        self.status_code = status_code

class MissingFields(Exception):
    def __init__(self, required_field: str, status_code=400):
        self.message = f'Missing fields, the required must include: {required_field}'
        super().__init__(self.message)
        self.status_code = status_code