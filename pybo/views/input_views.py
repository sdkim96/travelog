import os
from datetime import datetime, date, timedelta
from werkzeug.utils import secure_filename
from flask import Blueprint, url_for, request, render_template, g, session, jsonify, app
from werkzeug.utils import redirect, secure_filename
from flask import current_app as app
from pybo import db
from pybo.models import Health_Data, Exercise_Data, Signup_Data
from ..forms import InputForm
from pybo.views.main_views import login_required

bp = Blueprint('input', __name__, url_prefix='/input')

today = date.today()
month = today.month


# 신체 데이터 초기값 설정해주기
@bp.before_app_request
def defalut_health_data():
    check_user_id = session.get('user_id')
    if g.user:
        health_data = Health_Data.query.filter(Health_Data.user_id == check_user_id).all()
        health_data_count = len(health_data)
        exercise_data = Exercise_Data.query.filter(Exercise_Data.user_id == check_user_id).all()
        exercise_data_count = len(exercise_data)

        if health_data_count == 0:
            defalut_value = Health_Data(height=1, weight=0, body_fat=0, body_muscle=0, create_date=datetime.now(),
                                        user=g.user)
            db.session.add(defalut_value)
            db.session.commit()
        # if exercise_data_count == 0:
        # defalut_value = Exercise_Data(exercise_type='기본값', exercise_time=0, exercise_note='기본값', create_date=datetime.now(),user2=g.user)
        # db.session.add(defalut_value)
        # db.session.commit()

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


@bp.route('/', methods=['GET', 'POST'])
def input_index():
    return render_template('index.html')



@bp.route('/inputdata1')
@login_required
def input_data_html():
    return render_template('inputdata1.html')


@bp.route('/inputdata1', methods=('POST',))
def input_data1():
    height = request.form['height']
    weight = request.form['weight']
    body_fat = request.form['body_fat']
    body_muscle = request.form['body_muscle']
    data = Health_Data(height=height, weight=weight, body_fat=body_fat, body_muscle=body_muscle,
                       create_date=datetime.now(), user=g.user)
    db.session.add(data)
    db.session.commit()
    return render_template('complete.html')


@bp.route('/inputmonthdata1')
@login_required
def input_month_data_html():
    return render_template('inputmonthdata1.html')


@bp.route('/inputmonthdata1', methods=('POST',))
def input_month_data1():
    exercise_type = request.form['exercise_type']
    exercise_time = request.form['exercise_time']
    exercise_note = request.form['exercise_note']
    data = Exercise_Data(exercise_type=exercise_type, exercise_time=exercise_time, exercise_note=exercise_note,
                         create_date=datetime.now(), user2=g.user)
    db.session.add(data)
    db.session.commit()
    return render_template('complete.html')


@bp.route('/complete')
def input_complete():
    return render_template('complete.html')


@bp.route('/profilechange')
def profile_change():
    return render_template('profilechange.html')


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