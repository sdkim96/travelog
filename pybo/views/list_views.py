from datetime import datetime

from flask import Blueprint , url_for, request, render_template, session, g
from werkzeug.utils import redirect

from pybo import db
from pybo.models import Health_Data, Exercise_Data
from ..forms import InputForm
from pybo.views.main_views import login_required

bp = Blueprint('list', __name__, url_prefix='/list')

@bp.route('/bodydata/')
@login_required
def bodydatalist():
    page = request.args.get('page', type=int, default=1)
    check_user_id = session.get('user_id')
    if g.user:
        bodydata_list = Health_Data.query.order_by(Health_Data.create_date.desc()).filter(Health_Data.height != 1,
                                                                                          Health_Data.user_id == check_user_id)
    else:
        bodydata_list = Health_Data.query.filter(Health_Data.weight == 100000)

    bodydata_list = bodydata_list.paginate(page, per_page=10)

    return render_template('bodydata_list.html', bodydata_list=bodydata_list)


@bp.route('/exercisedata/')
@login_required
def exercisedatalist():
    page = request.args.get('page', type=int, default=1)
    check_user_id = session.get('user_id')
    if g.user:
        exercisedata_list = Exercise_Data.query.order_by(Exercise_Data.create_date.desc()).filter(Exercise_Data.exercise_time != 0,
                                                                                          Exercise_Data.user_id == check_user_id)
    else:
        exercisedata_list = Exercise_Data.query.filter(Exercise_Data.exercise_time == 100000)

    #exercisedata_list = Exercise_Data.query.order_by(Exercise_Data.create_date.desc())
    exercisedata_list = exercisedata_list.paginate(page, per_page=10)
    return render_template('exercisedata_list.html', exercisedata_list=exercisedata_list)

@bp.route('/delete/bodydata/<int:bodydata_id>')
def delete_bodydata(bodydata_id):
    bodydata = Health_Data.query.get_or_404(bodydata_id)
    db.session.delete(bodydata)
    db.session.commit()
    return redirect(url_for('list.bodydatalist'))


@bp.route('/delete/exercisedata/<int:exercisedata_id>')
def delete_exercisedata(exercisedata_id):
    exercisedata = Exercise_Data.query.get_or_404(exercisedata_id)
    db.session.delete(exercisedata)
    db.session.commit()
    return redirect(url_for('list.exercisedatalist'))