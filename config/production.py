from config.default import *

SQLALCHEMY_DATABASE_URI = 'sqlite:///{}'.format(os.path.join(BASE_DIR, 'mydata2.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = b'X\x07\xc86\tP\xfa\xd4\xb9J\x86\xeeqi\xc8\xa3'