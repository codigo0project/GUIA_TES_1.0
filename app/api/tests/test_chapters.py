from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_list_chapters():
    response = client.get("/v1/chapters")
    assert response.status_code == 200
    body = response.json()
    assert "total" in body
    assert "chapters" in body
    assert isinstance(body["chapters"], list)


def test_get_chapter_not_found():
    response = client.get("/v1/chapters/99.99-no-existe")
    assert response.status_code == 404
