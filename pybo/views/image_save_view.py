from flask import Flask, request

app = Flask(__name__)

@app.route('/save', methods=['POST'])
def save():
    text = request.form['text']  # 클라이언트로부터 받은 텍스트 데이터
    image = request.files['image']  # 클라이언트로부터 받은 이미지 파일 데이터
    if image:
        image.save('/path/to/save/image')  # 이미지 파일 저장
    # 텍스트 데이터 처리 코드 추가
    return 'success'  # 클라이언트에게 응답

@bp.route('/uploader', methods=('POST',))
def save():
     text = request.form['text']
     image = request.files['image']
     image = request.form['image']
     return 'success'

@bp.route('/uploader', methods=['POST',])
def uploader_file():

token_receive = request.cookies.get('mytoken')
user = db.citista_users.find_one({'token': token_receive})
user_id = user['username']

if request.method =='POST':
    f = request.files['file']
    save_to = f'static/img/profiles/user_id2.png'
    save_to = f'static/img/profiles/{user_id}'
    f.save(save_to)
    return f.filename

@bp.route('/uploader', methods=['POST'])
def uploader_file():

token_receive = request.cookies.get('mytoken')
user = db.citista_users.find_one({'token': token_receive})
user_id = user['username']

if request.method =='POST':
    text = request.form['text']
    image = request.files['image']
    save_to = 'static/image/img3.png'
    save_to = 'static/image/{user_id}'
    f.save(save_to)
    return f.filename