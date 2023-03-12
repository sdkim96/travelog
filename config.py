import os
BASE_DIR = os.path.dirname(__file__)

SQLALCHEMY_DATABASE_URI = 'sqlite:///{}'.format(os.path.join(BASE_DIR, 'mydata2.db')) #데이터베이스 접속 주소, 데이터베이스 이름설정
SQLALCHEMY_TRACK_MODIFICATIONS = False  #이벤트 처리 옵션 사용 안함


SECRET_KEY = "dev"
