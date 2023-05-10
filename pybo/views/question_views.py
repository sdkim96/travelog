from datetime import datetime
from sqlalchemy import func
from flask import Blueprint, render_template, request, url_for, g, flash
from werkzeug.utils import redirect, secure_filename
import os
import shutil
import re


from .. import db
from ..forms import QuestionForm, AnswerForm
from ..models import Question, Answer, Signup_Data, Friendship,question_voter
from pybo.views.main_views import login_required
from geopy.geocoders import Nominatim
bp = Blueprint('question', __name__, url_prefix='/question')
# image_path = 'pybo/static/image/'+ Question.user_id


def update_image_urls(content, question_id):
    pattern = re.compile(r'src="/static/temp_uploads/(.*?)"')
    new_content = pattern.sub(f'src="/static/image/{question_id}/\\1"', content)
    return new_content

#아랜 create()를 하면 content가 바뀌는 함수
def move_images(question_id):
    src_folder = f'pybo/static/temp_uploads/'
    dest_folder = f'pybo/static/image/' + "{}".format(question_id) + "/"

    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)

    for file in os.listdir(src_folder):
        src_file_path = os.path.join(src_folder, file)
        dest_file_path = os.path.join(dest_folder, file)
        shutil.move(src_file_path, dest_file_path)

geolocator = Nominatim(user_agent="geoapiExercises")

@bp.route('/get_location', methods=['GET'])
def get_location():
    address = request.args.get('address')
    if address:
        location = geolocator.geocode(address)
        if location:
            return jsonify({'latitude': location.latitude, 'longitude': location.longitude})
        else:
            return jsonify({'error': 'Unable to find the location for the given address.'})
    else:
        return jsonify({'error': 'Address parameter is missing.'})

@bp.route('/list/')
def _list():
        # 입력 파라미터
        page = request.args.get('page', type=int, default=1)
        kw = request.args.get('kw', type=str, default='')
        so = request.args.get('so', type=str, default='recent')

        # 정렬
        if so == 'recommend':
            question_list = Question.query.filter(Question.user_id == "{}".format(g.user.id)).order_by(Question.create_date.desc())

        elif so == 'popular':
            friend_ids = [friendship.user2_id for friendship in Friendship.query.filter_by(user1_id="{}".format(g.user.id)).all()]


            question_list = Question.query.filter(Question.user_id.in_(friend_ids)).order_by(Question.create_date.desc())
        else:  # recent
            question_list = Question.query.order_by(Question.create_date.desc())

        # 조회
        if kw:
            search = '%%{}%%'.format(kw)
            sub_query = db.session.query(Answer.question_id, Answer.content, Signup_Data.user_id) \
                .join(Signup_Data, Answer.user_id == Signup_Data.id).subquery()
            question_list = question_list \
                .join(Signup_Data) \
                .outerjoin(sub_query, sub_query.c.question_id == Question.id) \
                .filter(Question.subject.ilike(search) |  # 질문제목
                        Question.content.ilike(search) |  # 질문내용
                        Signup_Data.user_id.ilike(search) |  # 질문작성자
                        sub_query.c.content.ilike(search) |  # 답변내용
                        sub_query.c.user_id.ilike(search)  |# 답변작성자
                        Question.local.ilike(search) #지역x
                        ) \
                .distinct()

        # 페이징 # 한 페이지에 몇 개 넣을지 조정 가능
        question_list = question_list.paginate( per_page=12)
        return render_template('question/question_list.html', question_list=question_list, page=page, kw=kw, so=so)


@bp.route('/detail/<int:question_id>/')
def detail(question_id):
    form = AnswerForm()
    question = Question.query.get_or_404(question_id)
    return render_template('question/question_detail.html', question=question, form=form)


@bp.route('/create/', methods=('GET', 'POST'))
@login_required
def create():
    form = QuestionForm()
    if request.method == 'POST' and form.validate_on_submit():
        content = form.content.data
        question = Question(subject=form.subject.data, content=content, local=form.local.data, create_date=datetime.now(), user=g.user, img_name=None, summary=form.summary.data)
        db.session.add(question)
        db.session.commit()

        move_images(question.id)
        updated_content = update_image_urls(content, question.id)

        f = request.files.getlist('file[]')
        default_image_path = 'main_01.jpg'

        if f and f[0].filename != '':  # 이미지 파일이 선택된 경우
            os.makedirs(f'pybo/static/image/' + "{}".format(question.id) + "/", exist_ok=True)
            for fil in f:
                fil.save(os.path.join('pybo/static/image/' + "{}".format(question.id) + '/', fil.filename))
            question.img_name = f[0].filename  # 첫 번째 이미지 파일 이름 저장
        else:  # 이미지 파일이 선택되지 않은 경우
            question.img_name = default_image_path

        # 이미지 URL을 업데이트하고, 업데이트된 내용을 저장합니다.
        question.content = updated_content
        db.session.commit()

        return redirect(url_for('question._list', question_subject=question.subject, question_img_name=question.img_name))
    return render_template('question/question_form.html', form=form)




@bp.route('/modify/<int:question_id>', methods=('GET', 'POST'))
@login_required
def modify(question_id):
    form = QuestionForm()


    question = Question.query.get_or_404(question_id)
    content = form.content.data
    if g.user != question.user:
        flash('수정권한이 없습니다')
        return redirect(url_for('question.detail', question_id=question_id))
    if request.method == 'POST':
        form = QuestionForm()
        if form.validate_on_submit():
            form.populate_obj(question)
            question.modify_date = datetime.now()  # 수정일시 저장
            db.session.commit()

            move_images(question.id)
            updated_content = update_image_urls(content, question.id)

            f = request.files.getlist('file[]')
            default_image_path = 'main_01.jpg'

            if f and f[0].filename != '':  # 이미지 파일이 선택된 경우
                os.makedirs(f'pybo/static/image/' + "{}".format(question.id) + "/", exist_ok=True)
                for fil in f:
                    fil.save(os.path.join('pybo/static/image/' + "{}".format(question.id) + '/', fil.filename))
                question.img_name = f[0].filename  # 첫 번째 이미지 파일 이름 저장
            else:  # 이미지 파일이 선택되지 않은 경우
                question.img_name = default_image_path

            # 이미지 URL을 업데이트하고, 업데이트된 내용을 저장합니다.
            question.content = updated_content
            db.session.commit()
            return redirect(url_for('question.detail', question_id=question_id))
    else:
        form = QuestionForm(obj=question)
    return render_template('question/question_form.html', form=form)


@bp.route('/delete/<int:question_id>')
@login_required
def delete(question_id):
    question = Question.query.get_or_404(question_id)
    if g.user != question.user:
        flash('삭제권한이 없습니다')
        return redirect(url_for('question.detail', question_id=question_id))
    db.session.delete(question)
    db.session.commit()
    return redirect(url_for('question._list'))