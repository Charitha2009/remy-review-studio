from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_project_service
from app.models.project import Project
from app.schemas.project import ProjectResponse
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])

ProjectServiceDep = Annotated[ProjectService, Depends(get_project_service)]


@router.get("", response_model=list[ProjectResponse])
def list_projects(project_service: ProjectServiceDep) -> list[Project]:
    return project_service.list_projects()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, project_service: ProjectServiceDep) -> Project:
    return project_service.get_project(project_id)
