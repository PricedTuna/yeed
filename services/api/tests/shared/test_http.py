import json
from http import HTTPStatus

import pytest
from yeed_api.shared.errors import ApiError
from yeed_api.shared.http import create_app

from tests.support import http_event, lambda_context


def test_api_error_becomes_the_standard_error_response() -> None:
    app = create_app()

    @app.get("/conflict")
    def conflict() -> None:
        raise ApiError(HTTPStatus.CONFLICT, "already_exists", "That item already exists.")

    response = app.resolve(http_event("GET", "/conflict"), lambda_context())

    assert response["statusCode"] == 409
    assert json.loads(response["body"]) == {
        "error": {"code": "already_exists", "message": "That item already exists."}
    }


def test_unexpected_error_hides_internal_details(capsys: pytest.CaptureFixture[str]) -> None:
    app = create_app()

    @app.get("/boom")
    def boom() -> None:
        raise RuntimeError("connection to db-internal.example failed")

    response = app.resolve(http_event("GET", "/boom"), lambda_context())

    assert response["statusCode"] == 500
    assert json.loads(response["body"]) == {
        "error": {
            "code": "internal_error",
            "message": "Something went wrong on our side. Please try again later.",
        }
    }
    assert "db-internal" not in response["body"]
    # The details are not lost: they go to the logs for the team.
    assert "db-internal" in capsys.readouterr().out
