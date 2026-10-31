import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  const params = event.queryStringParameters || event;

  const user_id = params.user_id;
  const interaction_key = params.interaction_key;

  if (!user_id || !interaction_key) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Faltan las claves de la interacción",
      }),
    };
  }

  try {
    const response = await client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          user_id: { S: user_id },
          interaction_key: { S: interaction_key },
        },
      }),
    );

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          mensaje: "Interacción no encontrada",
        }),
      };
    }

    const item = response.Item;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: item.user_id?.S,
        interaction_key: item.interaction_key?.S,
        resource_id: item.resource_id?.S,
        interaction_type: item.interaction_type?.S,
        occurred_at: item.occurred_at?.S,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error al consultar DynamoDB",
      }),
    };
  }
};
