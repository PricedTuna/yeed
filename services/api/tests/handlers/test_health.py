import json

from yeed_api.handlers import health

from tests.support import http_event, lambda_context


def test_health_reports_that_the_api_is_up() -> None:
    response = health.handler(http_event("GET", "/health"), lambda_context())

    assert response["statusCode"] == 200
    assert response["headers"]["Content-Type"] == "application/json"
    # Exact match: the endpoint must not expose anything else.
    assert json.loads(response["body"]) == {"status": "ok", "service": "yeed-api"}


def test_unknown_route_returns_the_standard_error() -> None:
    response = health.handler(http_event("GET", "/missing"), lambda_context())

    assert response["statusCode"] == 404
    assert json.loads(response["body"]) == {
        "error": {"code": "not_found", "message": "The requested route does not exist."}
    }
