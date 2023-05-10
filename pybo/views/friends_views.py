from flask import Blueprint, request, render_template, g, redirect, url_for, jsonify, flash
from pybo.views.main_views import login_required
from pybo.models import db, Signup_Data, FollowNotification

bp = Blueprint('friends', __name__, url_prefix='/friends')

@bp.route('/find_friends')
def find_friends():
    users = Signup_Data.query.all()
    return render_template('friends/find_friends.html', users=users, current_user=g.user)

@bp.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        search_query = request.form.get('search_query')
        search_results = Signup_Data.query.filter(Signup_Data.user_name.ilike(f'%{search_query}%') | Signup_Data.user_id.ilike(f'%{search_query}%')).order_by(Signup_Data.id.asc()).all()
        return render_template('find_friends.html', search_results=search_results)
    elif request.method == 'GET':
        search_query = request.args.get('search_query')
        search_results = Signup_Data.query.filter(Signup_Data.user_name.ilike(f'%{search_query}%') | Signup_Data.user_id.ilike(f'%{search_query}%')).order_by(Signup_Data.id.asc()).all()
        return jsonify([{
            'id': users.id,
            'user_name': users.user_name,
            'user_id': users.user_id,
            'email': users.email,
            # 'image': user.image
        } for users in search_results])

@bp.route('/follow/<int:user_id>', methods=['POST'])
@login_required
def follow(user_id): #요건 id값임(singup_data.id인 idkey)
    user_to_follow = Signup_Data.query.get(user_id)
    if user_to_follow is None:
        flash('존재하지 않는 사용자입니다.')
        return redirect(url_for('friends.find_friends'))

    if g.user is not None:
        if g.user != user_to_follow:
            g.user.follow(user_to_follow)
            user_to_follow.add_follow_notification(g.user.id)
            db.session.commit()
        else:
            flash('나를 팔로우 할 수 없습니다.')
            return redirect(url_for('friends.find_friends'))

        
    return redirect(url_for('friends.find_friends', user_id=user_id))

@bp.route('/unfollow/<int:user_id>', methods=['POST'])
@login_required
def unfollow(user_id):
    user_to_unfollow = Signup_Data.query.get(user_id)
    if user_to_unfollow is None:
        flash('존재하지 않는 사용자입니다.')
        return redirect(url_for('friends.find_friends'))

    if g.user is not None:
        if g.user != user_to_unfollow:
            g.user.unfollow(user_to_unfollow)
            db.session.commit()
        else:
            flash('나를 언팔로우 할 수 없습니다.')
            return redirect(url_for('friends.find_friends'))
        
    return redirect(url_for('friends.find_friends', user_id=user_id))

@bp.route('/get_follow_notifications', methods=['GET'])
@login_required
def get_follow_notifications():
    user = g.user
    notifications = []

    if user is not None:
        all_notifications = user.notifications.order_by(FollowNotification.timestamp.desc()).all()
        for notification in all_notifications:
            sender = Signup_Data.query.get(notification.sender_id)
            notifications.append({
                "id": notification.id,
                "sender_id": sender.id,
                "sender_name": sender.user_name,
                "timestamp": notification.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "is_read": notification.is_read
            })

    return jsonify(notifications)