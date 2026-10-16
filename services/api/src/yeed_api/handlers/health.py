"""Lambda function for ``GET /health``.

Lets the frontend and the team check that the API is reachable. It does not use
the database or any other service, and it returns nothing sensitive.
"""

from typing import Any

from aws_lambda_powertools import Logger
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.utilities.typing import LambdaContext

from yeed_api.shared.http import create_app

SERVICE_NAME = "yeed-api"

logger = Logger()
app = create_app()


@app.get("/health")
def get_health() -> dict[str, str]:
    return {"status": "ok", "service": SERVICE_NAME}


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_HTTP)
def handler(event: dict[str, Any], context: LambdaContext) -> dict[str, Any]:
    return app.resolve(event, context)
