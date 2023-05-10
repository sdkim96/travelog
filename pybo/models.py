from pybo import db
from datetime import datetime


question_voter = db.Table(
    'question_voter',
    db.Column('user_id', db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), primary_key=True),
    db.Column('question_id', db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'), primary_key=True)
)

answer_voter = db.Table(
    'answer_voter',
    db.Column('user_id', db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), primary_key=True),
    db.Column('answer_id', db.Integer, db.ForeignKey('answer.id', ondelete='CASCADE'), primary_key=True)
)


class Health_Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    height = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    body_fat = db.Column(db.Integer, nullable=False)
    body_muscle = db.Column(db.Integer, nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('Signup_Data', backref=db.backref('question_set'))

class Exercise_Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise_type = db.Column(db.String(200), nullable=False)
    exercise_time = db.Column(db.Integer, nullable=False)
    exercise_note = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), nullable=False)
    user2 = db.relationship('Signup_Data', backref=db.backref('exercise_set'))


#팔로우 알람을 저장할 테이블
class FollowNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("signup__data.id"), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey("signup__data.id"), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

class Signup_Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.String(200), unique=True,nullable=False)
    user_password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(150), nullable=False)
    notifications = db.relationship("FollowNotification", foreign_keys=[FollowNotification.user_id], backref="user", lazy="dynamic")
    friends = db.relationship("Signup_Data",
                            secondary="friendship",
                            primaryjoin="Signup_Data.id==Friendship.user1_id",
                            secondaryjoin="Signup_Data.id==Friendship.user2_id",
                            backref=db.backref("followers", lazy="dynamic"),
                            lazy="dynamic")

    def follow(self, user):
        if user not in self.friends:
            self.friends.append(user)

    def unfollow(self, user):
        if user in self.friends:
            self.friends.remove(user)

    def add_follow_notification(self, sender_id):
        notification = FollowNotification(sender_id=sender_id, user_id=self.id)
        db.session.add(notification)
        db.session.commit()
    
class Friendship(db.Model):
    user1_id = db.Column(db.Integer, db.ForeignKey("signup__data.id"), primary_key=True)
    user2_id = db.Column(db.Integer, db.ForeignKey("signup__data.id"), primary_key=True)




class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('Signup_Data', backref=db.backref('question1_set'))
    modify_date = db.Column(db.DateTime(), nullable=True)
    voter = db.relationship('Signup_Data', secondary=question_voter, backref=db.backref('question_voter_set'))
    local = db.Column(db.String(200), nullable=False)
    img_name = db.Column(db.String(200))
    summary = db.Column(db.Text(), nullable=True)




class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'))
    question = db.relationship('Question', backref=db.backref('answer_set'))
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('Signup_Data', backref=db.backref('answer_set'))
    modify_date = db.Column(db.DateTime(), nullable=True)
    voter = db.relationship('Signup_Data', secondary=answer_voter, backref=db.backref('answer_voter_set'))


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('signup__data.id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('Signup_Data', backref=db.backref('comment_set'))
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    modify_date = db.Column(db.DateTime())
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'), nullable=True)
    question = db.relationship('Question', backref=db.backref('comment_set'))
    answer_id = db.Column(db.Integer, db.ForeignKey('answer.id', ondelete='CASCADE'), nullable=True)
    answer = db.relationship('Answer', backref=db.backref('comment_set'))