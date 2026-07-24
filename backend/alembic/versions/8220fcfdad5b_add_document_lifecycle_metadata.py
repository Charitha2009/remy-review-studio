"""add document lifecycle metadata

Revision ID: 8220fcfdad5b
Revises: d0734ba3c87d
Create Date: 2026-07-24 14:13:47.196233

Adds the columns Sprint 3's ingestion pipeline will need (content_type,
checksum_sha256, processing_error) and replaces `documents.status`
(DocumentStatus: uploaded/processing/ready/reviewing/reviewed) with
`processing_status` (ProcessingStatus: uploaded/queued/processing/ready/failed).

The old "reviewing"/"reviewed" values are dropped: nothing in the codebase
ever set them (grepped before writing this migration), and the roadmap
models engineer-review disposition on a separate Review/Finding entity
(Sprint 4, Issue #26), not on Document — so they were never load-bearing.

`checksum_sha256` is left NULL for pre-existing rows rather than backfilled
from disk: two dev-seeded documents in this project happen to share byte-for
-byte identical content (pre-dating this feature), and a NULL checksum is
exempt from the new (project_id, checksum_sha256) unique constraint in
SQLite/standard SQL (each NULL is distinct from every other NULL), so this
is both the honest choice (we don't know old rows' true content-type either)
and the one that can't fail the migration on real dev data.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8220fcfdad5b'
down_revision: Union[str, None] = 'd0734ba3c87d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_OLD_STATUS_VALUES = ("uploaded", "processing", "ready", "reviewing", "reviewed")
_NEW_STATUS_VALUES = ("uploaded", "queued", "processing", "ready", "failed")


def upgrade() -> None:
    op.add_column("documents", sa.Column("content_type", sa.String(), nullable=True))
    op.add_column("documents", sa.Column("checksum_sha256", sa.String(), nullable=True))
    op.add_column("documents", sa.Column("processing_error", sa.Text(), nullable=True))
    op.add_column(
        "documents",
        sa.Column(
            "processing_status",
            sa.Enum(*_NEW_STATUS_VALUES, name="documentprocessingstatus", native_enum=False),
            nullable=False,
            server_default="uploaded",
        ),
    )

    # Backfill processing_status from the old status column. "uploaded" rows need no
    # UPDATE (that's already the column default applied above). "reviewing"/"reviewed"
    # map to "ready" — by the time a document reached either of those, ingestion had
    # necessarily already finished.
    documents = sa.table(
        "documents",
        sa.column("status", sa.String()),
        sa.column("processing_status", sa.String()),
    )
    op.execute(
        documents.update()
        .where(documents.c.status == "processing")
        .values(processing_status="processing")
    )
    op.execute(
        documents.update().where(documents.c.status == "ready").values(processing_status="ready")
    )
    op.execute(
        documents.update()
        .where(documents.c.status.in_(["reviewing", "reviewed"]))
        .values(processing_status="ready")
    )

    op.create_index(
        op.f("ix_documents_project_id_checksum_sha256"),
        "documents",
        ["project_id", "checksum_sha256"],
        unique=True,
    )

    # SQLite can't DROP COLUMN without a table rebuild — batch mode handles that.
    with op.batch_alter_table("documents") as batch_op:
        batch_op.drop_column("status")


def downgrade() -> None:
    with op.batch_alter_table("documents") as batch_op:
        batch_op.add_column(
            sa.Column(
                "status",
                sa.Enum(*_OLD_STATUS_VALUES, name="documentstatus", native_enum=False),
                nullable=False,
                server_default="uploaded",
            )
        )

    documents = sa.table(
        "documents",
        sa.column("status", sa.String()),
        sa.column("processing_status", sa.String()),
    )
    op.execute(
        documents.update()
        .where(documents.c.processing_status == "processing")
        .values(status="processing")
    )
    op.execute(
        documents.update().where(documents.c.processing_status == "ready").values(status="ready")
    )
    op.execute(
        documents.update()
        .where(documents.c.processing_status.in_(["queued", "failed"]))
        .values(status="uploaded")
    )

    op.drop_index(op.f("ix_documents_project_id_checksum_sha256"), table_name="documents")

    with op.batch_alter_table("documents") as batch_op:
        batch_op.drop_column("processing_status")
        batch_op.drop_column("processing_error")
        batch_op.drop_column("checksum_sha256")
        batch_op.drop_column("content_type")
