"""
Simplify User model - remove deprecated fields

Revision ID: 001
Revises: 
Create Date: 2026-04-27

This migration removes deprecated fields from the users table:
- google_id
- avatar_url
- timezone
- updated_at
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Remove deprecated columns from users table."""
    # Drop columns if they exist
    columns_to_drop = ['google_id', 'avatar_url', 'timezone', 'updated_at']
    
    for column in columns_to_drop:
        try:
            op.drop_column('users', column)
        except Exception:
            # Column might not exist, skip
            pass
    
    # Make hashed_password NOT NULL if it was nullable before
    op.alter_column('users', 'hashed_password',
                    existing_type=sa.String(),
                    nullable=False)


def downgrade() -> None:
    """Add back deprecated columns (not recommended for production)."""
    op.add_column('users', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('timezone', sa.String(), nullable=True, default='UTC'))
    op.add_column('users', sa.Column('avatar_url', sa.String(), nullable=True))
    op.add_column('users', sa.Column('google_id', sa.String(), nullable=True))
