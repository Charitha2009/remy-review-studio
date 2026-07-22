from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


class ProjectRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> list[Project]:
        return list(self.db.execute(select(Project).order_by(Project.created_at.desc())).scalars())

    def get_by_id(self, project_id: str) -> Project | None:
        return self.db.get(Project, project_id)
