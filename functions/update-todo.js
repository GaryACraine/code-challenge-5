const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const { response } = require('../lib/http_help')

const { TODOS_TABLE_NAME } = process.env

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const { id, ...data } = JSON.parse(event.body);

  if (!id) {
    return response(400, { message: 'Missing id in request' });
  }

  const updateExpression = Object.keys(data)
    .map((key) => `${key} = :${key}`)
    .join(', ');
  const expressionAttributeValues = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [`:${key}`, value])
  );

  try {
    await DocumentClient
      .update({
        TableName: TODOS_TABLE_NAME,
        Key: { id },
        UpdateExpression: `set ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return response(200, { id, ...data });
  } catch (error) {
    console.error(error);
    return response(500, { message: 'Error updating item' });
  }
};
