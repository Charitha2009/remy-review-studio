import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.deps import get_storage_service
from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.models.project import Project, ProjectStatus
from app.services.storage_service import StorageService
from app.storage.local_storage import LocalStorageBackend

# Minimal valid magic-byte prefixes for each supported file type.
PDF_BYTES = b"%PDF-1.4\n%mock pdf content for tests\n"
DOCX_BYTES = b"PK\x03\x04mock docx content for tests"
DOC_BYTES = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1mock doc content for tests"


@pytest.fixture
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    testing_session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = testing_session_local()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()


@pytest.fixture
def upload_dir(tmp_path):
    path = tmp_path / "uploads"
    path.mkdir()
    return path


@pytest.fixture
def client(db_session, upload_dir):
    def override_get_db():
        yield db_session

    def override_get_storage_service() -> StorageService:
        return StorageService(LocalStorageBackend(upload_dir))

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_storage_service] = override_get_storage_service

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def seeded_project(db_session) -> Project:
    project = Project(
        id="test-project",
        name="Test Project",
        project_number="PRJ-TEST-001",
        client="Test Client",
        location="Testville",
        building_type="Office",
        description="A seeded project for tests.",
        status=ProjectStatus.active,
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    return project
