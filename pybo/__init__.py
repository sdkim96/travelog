#2023년 4월 25일 변경사항
# 1. import os
# 2.  app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static/uploads')
#     app.config['UPLOAD_SUBFOLDER'] = 'uploads'
# 3. 블루프린트 등록(image_views)
# 4. route views 등록


from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from pybo.views.utils import is_directory


import os
import config

naming_convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

db = SQLAlchemy(metadata=MetaData(naming_convention=naming_convention))
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    #2023년 4월 25일 변경사항 아래 3줄
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static/uploads')
    app.config['UPLOAD_SUBFOLDER'] = 'uploads'
    app.config['TEMP_UPLOAD_FOLDER'] = 'pybo/static/temp_uploads'
    app.config['TEMP_UPLOAD_SUBFOLDER'] = 'temp_uploads'
    app.jinja_env.globals.update(is_directory=is_directory) 


    # ORM
    db.init_app(app)
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith("sqlite"):
        migrate.init_app(app, db, render_as_batch=True)
    else:
        migrate.init_app(app, db)
    from . import models

    # 블루프린트
    from .views import main_views, input_views, question_views, answer_views, comment_views, vote_views, openai_views, image_views, route_views, friends_views
    app.register_blueprint(main_views.bp)
    app.register_blueprint(input_views.bp)
    app.register_blueprint(question_views.bp)
    app.register_blueprint(answer_views.bp)
    app.register_blueprint(comment_views.bp)
    app.register_blueprint(vote_views.bp)
    app.register_blueprint(openai_views.bp)
    app.register_blueprint(image_views.bp)
    app.register_blueprint(route_views.bp)
    app.register_blueprint(friends_views.bp)

    # 필터
    from .filter import format_datetime
    app.jinja_env.filters['datetime'] = format_datetime

    return app
