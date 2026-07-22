from app.core.exceptions import NotFoundError
from app.models.project import Project
from app.repositories.project_repository import ProjectRepository


class ProjectService:
    def __init__(self, project_repository: ProjectRepository) -> None:
        self.project_repository = project_repository

    def list_projects(self) -> list[Project]:
        return self.project_repository.get_all()

    def get_project(self, project_id: str) -> Project:
        project = self.project_repository.get_by_id(project_id)
        if project is None:
            raise NotFoundError(f"Project '{project_id}' was not found.")
        return project
