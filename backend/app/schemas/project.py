from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.models.project import ProjectStatus


class ProjectResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    name: str
    project_number: str | None
    client: str | None
    location: str | None
    building_type: str | None
    description: str | None
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime
