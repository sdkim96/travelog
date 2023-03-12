from datetime import datetime, date, timedelta

from flask import Blueprint , url_for, request, render_template,g,session
from werkzeug.utils import redirect

from pybo import db
from pybo.models import Health_Data, Exercise_Data, Signup_Data
from ..forms import InputForm
from pybo.views.main_views import login_required

bp = Blueprint('input', __name__, url_prefix='/input')

today = date.today()
month = today.month

#신체 데이터 초기값 설정해주기
@bp.before_app_request
def defalut_health_data():
    check_user_id = session.get('user_id')
    if g.user:
        health_data = Health_Data.query.filter(Health_Data.user_id == check_user_id).all()
        health_data_count = len(health_data)
        exercise_data = Exercise_Data.query.filter(Exercise_Data.user_id == check_user_id).all()
        exercise_data_count = len(exercise_data)

        if health_data_count == 0:
            defalut_value = Health_Data(height=1, weight=0, body_fat=0, body_muscle=0, create_date=datetime.now(),user=g.user)
            db.session.add(defalut_value)
            db.session.commit()
        #if exercise_data_count == 0:
            #defalut_value = Exercise_Data(exercise_type='기본값', exercise_time=0, exercise_note='기본값', create_date=datetime.now(),user2=g.user)
            #db.session.add(defalut_value)
            #db.session.commit()

@bp.route('/')
def input_index():
    check_user_id = session.get('user_id')
    if g.user:
        health_data = Health_Data.query.filter(Health_Data.user_id == check_user_id).all()
        health_data_count = len(health_data)

        if health_data_count >=3:
            recent_month1 = Health_Data.query.filter(Health_Data.user_id == check_user_id).order_by(Health_Data.id.desc())[0]
            recent_month2 = Health_Data.query.filter(Health_Data.user_id == check_user_id).order_by(Health_Data.id.desc())[1]
            recent_month3 = Health_Data.query.filter(Health_Data.user_id == check_user_id).order_by(Health_Data.id.desc())[2]
        elif 0<health_data_count<3:
            recent_month1 = Health_Data.query.filter(Health_Data.user_id == check_user_id).order_by(Health_Data.id.desc())[0]
            recent_month2 = Health_Data.query.filter(Health_Data.height==1)[0]
            recent_month3 = Health_Data.query.filter(Health_Data.height==1)[0]
    else:
        recent_month1 = Health_Data.query.filter(Health_Data.height == 1)[0]
        recent_month2 = Health_Data.query.filter(Health_Data.height == 1)[0]
        recent_month3 = Health_Data.query.filter(Health_Data.height == 1)[0]

    test = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    c = 0
    default_last_exercise = Exercise_Data.query.filter(Exercise_Data.exercise_time == 0)[0]

    if g.user:
        last_exercise = Exercise_Data.query.filter(Exercise_Data.user_id == check_user_id).order_by((Exercise_Data.create_date.desc()))

        for i in last_exercise:
            test.insert(c,i)
            c += 1

    else:
        for i in range(31):
            test.append(default_last_exercise)

    last_exercise = Exercise_Data.query.filter(Exercise_Data.user_id == check_user_id).all()
    count_last_exercise = len(last_exercise)
    profile_last_exercise = 0

    if count_last_exercise > 0:
        profile_last_exercise = Exercise_Data.query.filter(Exercise_Data.user_id == check_user_id).order_by(
        (Exercise_Data.create_date.desc()))



    return render_template('index.html', recent_month1=recent_month1, recent_month2=recent_month2,
                           recent_month3=recent_month3,test=test, profile_last_exercise=profile_last_exercise)




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
    data = Health_Data(height=height, weight=weight, body_fat=body_fat, body_muscle=body_muscle, create_date=datetime.now(), user=g.user)
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
    data = Exercise_Data(exercise_type=exercise_type, exercise_time=exercise_time, exercise_note=exercise_note, create_date=datetime.now(), user2=g.user)
    db.session.add(data)
    db.session.commit()
    return render_template('complete.html')

@bp.route('/complete')
def input_complete():
    return render_template('complete.html')

@bp.route('/profilechange')
def profile_change():
    return render_template('profilechange.html')

@bp.route('/profilechange', methods=('POST',))
def input_profile_change():
    profile = Signup_Data.query.filter(Signup_Data.id == g.user.id)[0]

    if request.form['username']:
        username = request.form['username']
    else:
        username =  profile.user_name

    if request.form['useremail']:
        useremail = request.form['useremail']
    else:
        useremail =  profile.email

    if request.form['useraddress']:
        useraddress = request.form['useraddress']
    else:
        useraddress =  profile.address

    if request.form['userphone']:
        userphone = request.form['userphone']
    else:
        userphone =  profile.phone

    profile.user_name = username
    profile.email = useremail
    profile.address = useraddress
    profile.phone = userphone
    db.session.commit()
    return render_template('main.html')

