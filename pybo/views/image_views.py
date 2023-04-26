# 아래 파이썬 파일은 question_form에서 /file_upload로 언급된 엔드포인트를 정의하고 있으며,
# 클라이언트 측에서 이미지를 받아와 디비에 저장하고, 다시 클라이언트에게 이미지를 전달하는
# 역할을 하고 있다.
# ckfinder 절대 쓰지마!!!!!!!!!!!!!!!!!!!!!!!!!!! <- 설치해야 하는 모듈도 존나많고 머리아픔
# 쓸거면 로컬에 제대로 업데이트된 모듈을 넣던가 아니면 웹에서 가져오던가..

# 2023-04-25 첫 작성 완료. 수정되는 대로 계속 주석 알려주세요.

from flask import Blueprint, request, jsonify, url_for, current_app
import os
import shutil

bp = Blueprint('image', __name__, url_prefix='/image')

@bp.before_app_request
def create_upload_folder():
    # 이미지 저장 폴더 생성
    if not os.path.exists(current_app.config['UPLOAD_FOLDER']):
        os.makedirs(current_app.config['UPLOAD_FOLDER'])
    
    # 임시 이미지 저장 폴더 생성
    if not os.path.exists(current_app.config['TEMP_UPLOAD_FOLDER']):
        os.makedirs(current_app.config['TEMP_UPLOAD_FOLDER'])

@bp.route('/fileupload/', methods=["POST"])
def upload_image():
    # 이미지 파일을 확인.
    if 'upload' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['upload']

    # 파일 이름을 확인.
    if file.filename == '':
        return jsonify({'error': 'No file provided'}), 400

    # 파일을 임시 저장 폴더에 저장.
    file.save(os.path.join(current_app.config['TEMP_UPLOAD_FOLDER'], file.filename))

    # 저장된 이미지의 URL을 반환.
    image_url = url_for('static', filename=f'{current_app.config["TEMP_UPLOAD_SUBFOLDER"]}/{file.filename}')
    return jsonify({'uploaded': True, 'url': image_url})