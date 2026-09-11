from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_search_returns_envelope():
    response = client.get("/search", params={"q": "RCP"})
    assert response.status_code == 200
    body = response.json()
    assert "query" in body
    assert "total" in body
    assert "results" in body
    assert body["query"] == "RCP"


def test_search_empty_query():
    response = client.get("/search", params={"q": ""})
    assert response.status_code == 200
    body = response.json()
    assert body["query"] == ""
