"""Builders for the inputs Lambda receives, so handlers can be tested without AWS."""

from dataclasses import dataclass
from typing import Any, cast

from aws_lambda_powertools.utilities.typing import LambdaContext

ALLOWED_ORIGIN = "http://localhost:5173"


@dataclass(frozen=True)
class _FakeLambdaContext:
    function_name: str = "yeed-test"
    function_version: str = "$LATEST"
    memory_limit_in_mb: int = 256
    invoked_function_arn: str = (
        "arn:aws:lambda:us-east-1:123456789012:function:yeed-test"
    )
    aws_request_id: str = "test-request-id"


def lambda_context() -> LambdaContext:
    """Returns the Lambda context attributes that handlers and Powertools read."""
    return cast(LambdaContext, _FakeLambdaContext())


def http_event(method: str, path: str) -> dict[str, Any]:
    """Builds an API Gateway HTTP API event (payload format 2.0)."""
    return {
        "version": "2.0",
        "routeKey": f"{method} {path}",
        "rawPath": path,
        "rawQueryString": "",
        "headers": {"accept": "application/json", "origin": ALLOWED_ORIGIN},
        "requestContext": {
            "accountId": "123456789012",
            "apiId": "test-api",
            "domainName": "test-api.execute-api.us-east-1.amazonaws.com",
            "http": {
                "method": method,
                "path": path,
                "protocol": "HTTP/1.1",
                "sourceIp": "127.0.0.1",
                "userAgent": "pytest",
            },
            "requestId": "test-request-id",
            "routeKey": f"{method} {path}",
            "stage": "$default",
            "time": "16/Oct/2026:12:00:00 +0000",
            "timeEpoch": 1792152000000,
        },
        "isBase64Encoded": False,
    }
