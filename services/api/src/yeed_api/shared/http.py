"""HTTP application setup shared by every Lambda handler.

Every error leaves the API with the same JSON shape::

    {"error": {"code": "not_found", "message": "Text that is safe to show to users."}}
"""

from http import HTTPStatus

from aws_lambda_powertools import Logger
from aws_lambda_powertools.event_handler import (
    APIGatewayHttpResolver,
    Response,
    content_types,
)
from aws_lambda_powertools.event_handler.exceptions import NotFoundError

from yeed_api.shared.errors import ApiError

type ErrorBody = dict[str, dict[str, str]]

logger = Logger(child=True)


def error_response(status: HTTPStatus, code: str, message: str) -> Response[ErrorBody]:
    """Builds an error response in the API's standard format."""
    return Response(
        status_code=status,
        content_type=content_types.APPLICATION_JSON,
        body={"error": {"code": code, "message": message}},
    )


def create_app() -> APIGatewayHttpResolver:
    """Creates a router for API Gateway HTTP API events with the shared error handling."""
    app = APIGatewayHttpResolver()

    @app.not_found
    def handle_not_found(_error: NotFoundError) -> Response[ErrorBody]:
        return error_response(
            HTTPStatus.NOT_FOUND, "not_found", "The requested route does not exist."
        )

    @app.exception_handler(ApiError)
    def handle_api_error(error: ApiError) -> Response[ErrorBody]:
        return error_response(error.status, error.code, error.message)

    @app.exception_handler(Exception)
    def handle_unexpected_error(_error: Exception) -> Response[ErrorBody]:
        # The traceback goes to the logs; the user only gets a generic message.
        logger.exception("Unhandled error")
        return error_response(
            HTTPStatus.INTERNAL_SERVER_ERROR,
            "internal_error",
            "Something went wrong on our side. Please try again later.",
        )

    return app
