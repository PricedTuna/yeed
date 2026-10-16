
import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("yeed-interactions-p07")


def lambda_handler(event, context):
    action = event["action"]

    # CREATE: insertar interacción
    if action == "create":
        item = event["item"]

        table.put_item(
            Item=item,
            ConditionExpression=(
                "attribute_not_exists(user_id) AND "
                "attribute_not_exists(interaction_key)"
            )
        )

        return {"operation": "CREATE", "item": item}

    # READ: buscar por usuario, más recientes primero
    if action == "read":
        result = table.query(
            KeyConditionExpression=Key("user_id").eq(
                event["user_id"]
            ),
            ScanIndexForward=False,
            ReturnConsumedCapacity="TOTAL"
        )

        return {
            "operation": "READ",
            "items": result["Items"],
            "count": result["Count"],
            "capacity": result["ConsumedCapacity"]
        }

    # UPDATE: cambiar el tipo de interacción
    if action == "update":
        result = table.update_item(
            Key={
                "user_id": event["user_id"],
                "interaction_key": event["interaction_key"]
            },
            UpdateExpression="SET interaction_type = :t",
            ExpressionAttributeValues={
                ":t": event["interaction_type"]
            },
            ConditionExpression=(
                "attribute_exists(user_id) AND "
                "attribute_exists(interaction_key)"
            ),
            ReturnValues="ALL_NEW"
        )

        return {
            "operation": "UPDATE",
            "item": result["Attributes"]
        }

    # DELETE: eliminar una interacción
    if action == "delete":
        result = table.delete_item(
            Key={
                "user_id": event["user_id"],
                "interaction_key": event["interaction_key"]
            },
            ConditionExpression=(
                "attribute_exists(user_id) AND "
                "attribute_exists(interaction_key)"
            ),
            ReturnValues="ALL_OLD"
        )

        return {
            "operation": "DELETE",
            "deleted_item": result["Attributes"]
        }

    # SCAN: búsqueda ineficiente para comparar
    if action == "scan":
        result = table.scan(
            FilterExpression=Attr("interaction_type").eq("VIEW"),
            ReturnConsumedCapacity="TOTAL"
        )

        return {
            "operation": "SCAN",
            "matched": result["Count"],
            "scanned": result["ScannedCount"],
            "capacity": result["ConsumedCapacity"]
        }

    # READ mediante índice secundario
    if action == "by_resource":
        result = table.query(
            IndexName="resource_id-index",
            KeyConditionExpression=Key("resource_id").eq(
                event["resource_id"]
            ),
            ReturnConsumedCapacity="TOTAL"
        )

        return {
            "operation": "READ_GSI",
            "items": result["Items"],
            "capacity": result["ConsumedCapacity"]
        }

    return {"error": "Operacion no reconocida"}
