"""Errors that the API turns into consistent HTTP responses."""

from http import HTTPStatus


class ApiError(Exception):
    """An expected failure, such as invalid input or a missing resource.

    ``message`` is shown to users, so it must never contain internal details.
    """

    def __init__(self, status: HTTPStatus, code: str, message: str) -> None:
        super().__init__(message)
        self.status = status
        self.code = code
        self.message = message
