from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FloatField, PasswordField, EmailField
from wtforms.validators import DataRequired, Length, EqualTo, Email
from werkzeug.utils import secure_filename

class UserCreateForm(FlaskForm):
    name = StringField('사용자이름', validators=[DataRequired()])
    userid = StringField('', validators=[DataRequired(), Length(min=3, max=15)])
    password1 = PasswordField('', validators=[
        DataRequired(), EqualTo('password2', '비밀번호가 일치하지 않습니다')])
    password2 = PasswordField('비밀번호확인', validators=[DataRequired()])
    email = EmailField('', validators=[DataRequired(), Email('이메일 형식이 옳지 않습니다')])
    phone_number = StringField('핸드폰', validators=[DataRequired()])

class UserLoginForm(FlaskForm):
    userid = StringField('사용자이름', validators=[DataRequired(), Length(min=3, max=25)])
    password = PasswordField('비밀번호', validators=[DataRequired()])

class QuestionForm(FlaskForm):
    subject = StringField('제목', validators=[DataRequired('제목은 필수입력 항목입니다.')])
    content = TextAreaField('내용', validators=[DataRequired('내용은 필수입력 항목입니다.')])
    # filename = StringField('사진', validators=[DataRequired('대표 사진은 필수입력 항목입니다.')])
    local = StringField('지역',  validators=[DataRequired('운동하고 싶은 지역을 입력해 주세요')] ,)
    summary = TextAreaField('요약')

class AnswerForm(FlaskForm):
    content = TextAreaField('내용', validators=[DataRequired('내용은 필수입력 항목입니다.')])

class CommentForm(FlaskForm):
    content = TextAreaField('내용', validators=[DataRequired()])

