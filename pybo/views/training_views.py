from datetime import datetime

from flask import Blueprint, url_for, render_template, flash, request, session, g
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect

from pybo import db
from pybo.models import Health_Data, Exercise_Data,Signup_Data
from ..forms import UserCreateForm, UserLoginForm

import functools

bp = Blueprint('training', __name__, url_prefix='/training')


@bp.route('/training/')
def training():
    return render_template('training_index.html')
