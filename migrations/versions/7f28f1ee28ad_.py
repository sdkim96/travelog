"""empty message

Revision ID: 7f28f1ee28ad
Revises: 27e481c482a5
Create Date: 2023-04-28 14:54:20.267154

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7f28f1ee28ad'
down_revision = '27e481c482a5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('friendship',
    sa.Column('user1_id', sa.Integer(), nullable=False),
    sa.Column('user2_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user1_id'], ['signup__data.id'], name=op.f('fk_friendship_user1_id_signup__data')),
    sa.ForeignKeyConstraint(['user2_id'], ['signup__data.id'], name=op.f('fk_friendship_user2_id_signup__data')),
    sa.PrimaryKeyConstraint('user1_id', 'user2_id', name=op.f('pk_friendship'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('friendship')
    # ### end Alembic commands ###
