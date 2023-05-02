# 아래 파이썬 파일은 question 테이블에서 userid와 local(아이디와 위치정보를 가져옴)
# 가져와서 index.html의 맵에 마커를 만들어주는 역할을 하는 백엔드임

# 2023-04-25 첫 작성 완료. 수정되는 대로 계속 주석 알려주세요.
# 230426 signs리스트가져오는 매커니즘 추가(key값 맞추기 위해서)


from flask import Blueprint, jsonify, g
from pybo.models import db, Question, Signup_Data, Friendship
from pybo.views.main_views import login_required


bp = Blueprint('route', __name__, url_prefix='/route')

@bp.route('/get_markers', methods=['GET'])
def get_markers():
    markers = []
    questions = Question.query.all()
    signs= Signup_Data.query.all()

    user_id_to_name={}
    for sign in signs:
        user_id_to_name[sign.id] = sign.user_name
    
    for question in questions:
        marker_info = {
            'id' : question.id,
            'subject': question.subject,
            'user_id': user_id_to_name[question.user_id],
            'local': question.local,
            'content': question.content,
            'img_name' : question.img_name
        }
        markers.append(marker_info)

    return jsonify(markers)

@bp.route('/get_friends', methods=['GET'])
@login_required
def get_friends():
    user = g.user
    friends_questions = []

    if user is not None:
        # 현재 로그인한 사용자와 친구 관계인 사용자들의 user_id를 얻습니다.
        friend_user_ids = [friendship.user2_id for friendship in Friendship.query.filter_by(user1_id=user.id).all()]

        for friend_user_id in friend_user_ids:
            friend_questions = Question.query.filter_by(user_id=friend_user_id).all()
            friend = Signup_Data.query.get(friend_user_id)
            for question in friend_questions:
                question_data = {
                    "id": question.id,
                    "subject": question.subject,
                    "user_name": friend.user_name,
                    "local": question.local,
                    "content": question.content,
                    "img_name": question.img_name
                }
                friends_questions.append(question_data)

    return jsonify(friends_questions)



# 아래 코드는 수정 전 코드입니다.

# Question.query.get

# from flask import Blueprint, jsonify, g
# from pybo.models import db, Question
# from pybo.views.main_views import login_required

# bp = Blueprint('route', __name__, url_prefix='/route')

# @bp.route('/get_markers', methods=['GET'])
# @login_required
# def get_markers():
#     user_id = g.user.user_id
#     markers = []
#     questions = Question.query.filter_by(user_id=user_id).all()
#     for question in questions:
#         marker_info = {
#             'id' : question.id,
#             'user_id': question.user_id,
#             'local': question.local,
#             'content': question.content,
#             'img_name' : question.img_name
#         }
#         markers.append(marker_info)
#     return jsonify(markers)