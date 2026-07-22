def test_list_projects_returns_seeded_project(client, seeded_project):
    response = client.get("/api/v1/projects")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == seeded_project.id
    assert body[0]["projectNumber"] == "PRJ-TEST-001"


def test_get_project_by_id(client, seeded_project):
    response = client.get(f"/api/v1/projects/{seeded_project.id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Test Project"


def test_get_missing_project_returns_404_with_request_id(client):
    response = client.get("/api/v1/projects/does-not-exist")

    assert response.status_code == 404
    body = response.json()
    assert "does-not-exist" in body["detail"]
    assert body["request_id"]
