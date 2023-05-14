from datetime import datetime

from flask import Blueprint, url_for, render_template, flash, request, session, g, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect

from pybo import db
from pybo.models import Signup_Data
from ..forms import UserCreateForm, UserLoginForm

import functools

bp = Blueprint('main', __name__, url_prefix='/')


@bp.route('/')
def main():
    current_app.logger.info("INFO 레벨로 출력")
    return render_template('main.html')


@bp.route('/signup', methods=('GET', 'POST'))
def signup():
    form = UserCreateForm()
    if request.method == 'POST' and form.validate_on_submit():
        user = Signup_Data.query.filter_by(user_id=form.userid.data).first()
        if not user:
            user = Signup_Data(user_name=form.name.data,
                               user_id=form.userid.data,
                               user_password=generate_password_hash(form.password1.data),
                               email=form.email.data,
                               phone=form.phone_number.data
                               )
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('main.main'))
        else:
            flash('이미 존재하는 사용자입니다.')
    return render_template('/signup.html', form=form)


@bp.route('/login/', methods=('GET', 'POST'))
def login_page():
    form = UserLoginForm()
    if request.method == 'POST' and form.validate_on_submit():
        error = None
        user = Signup_Data.query.filter_by(user_id=form.userid.data).first()
        if not user:
            error = "존재하지 않는 사용자입니다."
        elif not check_password_hash(user.user_password, form.password.data):
            error = "비밀번호가 올바르지 않습니다."
        if error is None:
            session.clear()
            session['user_id'] = user.id
            return redirect(url_for('main.main'))
        flash(error)
    return render_template('login.html', form=form)


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        g.user = Signup_Data.query.get(user_id)


@bp.route('/logout/')
def logout():
    session.clear()
    return redirect(url_for('main.main'))


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            _next = request.url if request.method == 'GET' else ''
            return redirect(url_for('main.login_page', next=_next))
        return view(*args, **kwargs)

    return wrapped_view
