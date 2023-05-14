import os
from datetime import datetime, date, timedelta
from werkzeug.utils import secure_filename
from flask import Blueprint, url_for, request, render_template, g, session, jsonify, app
from werkzeug.utils import redirect, secure_filename
from flask import current_app as app
from pybo import db
from pybo.models import Signup_Data
from ..forms import InputForm
from pybo.views.main_views import login_required

bp = Blueprint('input', __name__, url_prefix='/input')

today = date.today()
month = today.month


@bp.route('/', methods=['GET', 'POST'])
def input_index():
    return render_template('index.html')

@bp.route('/upload', methods=('GET', 'POST'))
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        os.makedirs(f'pybo/static/image/profile/' + "{}".format(g.user.user_id) + "/", exist_ok=True)
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join('pybo/static/image/profile/' + "{}".format(g.user.user_id) + '/', filename))
            g.user.profile_img = filename
            db.session.commit()
        return redirect(url_for('input.upload_file'))
    return render_template('index.html')

@bp.route('/save/', methods=['GET','POST'])

def allowed_extensions():
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions()

def save():
    uploaded = os.path.join('travel-log', 'pybo', 'static', 'image')
    app.config['uploaded'] = uploaded
    text = request.form['data']  # 클라이언트로부터 받은 텍스트 데이터
    image = request.files['image']  # 클라이언트로부터 받은 이미지 파일 데이터
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['uploaded'], filename))
        return jsonify({"result": "success"})
    else:
        return jsonify({"result": "failure"})