# 아래 파이썬 파일은 question 테이블에서 userid와 local(아이디와 위치정보를 가져옴)
# 가져와서 index.html의 맵에 마커를 만들어주는 역할을 하는 백엔드임

# 2023-04-25 첫 작성 완료. 수정되는 대로 계속 주석 알려주세요.
# 230426 signs리스트가져오는 매커니즘 추가(key값 맞추기 위해서)


from flask import Blueprint, jsonify, g, session, request
from pybo.models import db, Question, Signup_Data, Friendship, AddMarker
from pybo.views.main_views import login_required


bp = Blueprint('route', __name__, url_prefix='/route')

@bp.route('/get_markers', methods=['GET'])
def get_markers():
    markers = []
    questions = Question.query.all()
    signs= Signup_Data.query.all()

    user_id_to_name={}
    for sign in signs:
        user_id_to_name[sign.id] = sign.id
    
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
    friends_list = []

    if user is not None:
        # 현재 로그인한 사용자와 친구 관계인 사용자들의 user_id를 얻습니다.
        friend_user_ids = [friendship.user2_id for friendship in Friendship.query.filter_by(user1_id=user.id).all()]

        for friend_user_id in friend_user_ids:
            friend = Signup_Data.query.get(friend_user_id)
            friend_data = {
                "user_id": friend.id,
                "user_name": friend.user_name,
            }
            friends_list.append(friend_data)

    return jsonify(friends_list)

@bp.route('/get_my_id', methods=['GET'])
@login_required
def get_my_id():
    user = g.user
    return jsonify(user.id)

@bp.route('/add_marker', methods=['POST'])
@login_required
def add_marker():
    data = request.form

    image = request.files.get('image_dir')
    image_path = None

    if image:
        # Save the image and set image_path to the location it was saved to
        pass  # Replace this with your image saving logic

    marker2 = AddMarker(
        user_id=data.get('user_id'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        title=data.get('title'),
        content=data.get('content'),
        image_dir=image_path  # Replace with the saved image path
    )

    db.session.add(marker2)
    db.session.commit()

    return {'message': 'New marker added successfully'}, 201


# def create_posting_dict(posting):
#     return {
#         'id': posting.id,
#         'img_name': posting.img_name,
#         'subject': posting.subject,
#         'content': posting.content,
#         'local': posting.local,
#         'create_date': posting.create_date.strftime('%Y-%m-%d %H:%M:%S'),  # 날짜를 문자열로 변환
#         'user_name': posting.user_id  # 유저 이름을 가져오는 코드로 수정해야 합니다.
#     }

# # 모든 포스팅 가져오기
# @bp.route('/get_all_postings', methods=['GET'])
# @login_required
# def get_all_postings():
#     questions = Question.query.all()
#     postings = [create_posting_dict(question) for question in questions]
#     return jsonify(postings)

# # 내 게시물 찾기
# @bp.route('/get_my_postings', methods=['GET'])
# @login_required
# def get_my_postings():
#     user_id = session['user_id']  # 세션에서 사용자 ID를 가져옵니다
#     my_postings = Question.query.filter_by(user_id=user_id).all()  # 사용자의 게시물만 선택합니다
#     postings = [create_posting_dict(posting) for posting in my_postings]
#     return jsonify(postings)

# # 친구 게시물 찾기
# @bp.route('/get_friends_postings', methods=['GET'])
# @login_required
# def get_friend_postings():
#     user_id = session['user_id']  # 세션에서 사용자 ID를 가져옵니다
#     user = Signup_Data.query.get(user_id)
#     friends = user.friends  # 사용자의 친구 목록을 가져옵니다.
#     friend_postings = Question.query.filter(Question.user_id.in_([friend.id for friend in friends])).all()  # 친구의 게시물만 선택합니다
#     postings = [create_posting_dict(posting) for posting in friend_postings]
#     return jsonify(postings)




# @bp.route('/get_friends_posts', methods=['GET'])
# @login_required
# def get_friends():
#     user = g.user
#     friends_questions = []

#     if user is not None:
#         # 현재 로그인한 사용자와 친구 관계인 사용자들의 user_id를 얻습니다.
#         friend_user_ids = [friendship.user2_id for friendship in Friendship.query.filter_by(user1_id=user.id).all()]

#         for friend_user_id in friend_user_ids:
#             friend_questions = Question.query.filter_by(user_id=friend_user_id).all()
#             friend = Signup_Data.query.get(friend_user_id)
#             for question in friend_questions:
#                 question_data = {
#                     "id": question.id,
#                     "subject": question.subject,
#                     "user_name": friend.user_name,
#                     "local": question.local,
#                     "content": question.content,
#                     "img_name": question.img_name
#                 }
#                 friends_questions.append(question_data)

#     return jsonify(friends_questions)

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

# 전체게시물 찾기
