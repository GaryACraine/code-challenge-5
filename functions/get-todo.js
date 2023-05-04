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
  const { id } = event.pathParameters;

  if (!id) {
    return response(400, { message: "Missing id in request" });
  }

  try {
    return await DocumentClient.get({
      TableName: TODOS_TABLE_NAME,
      Key: { id },
    })
      .promise()
      .then((data) => response(200, data))
  } catch (error) {
    console.error(error)
    return response(500, { message: "Error deleting item" });
  }
};
