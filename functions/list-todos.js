const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();
const { response } = require("../lib/http_help");

const { TODOS_TABLE_NAME } = process.env;

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  let exclusiveStartKey, limit;
  if (event.queryStringParameters?.nextToken) {
    const nextTokenParam = event.queryStringParameters?.nextToken;
    const nextTokenJson = Buffer.from(nextTokenParam, "base64").toString(
      "ascii"
    );
    exclusiveStartKey = JSON.parse(nextTokenJson);
  }

  if (event.queryStringParameters?.count) {
    limit = parseInt(event.queryStringParameters?.count);
  }

  //TODO should be using query, on hash key userId (table with hash key userId, range key todoId), will implement time permitting
  const result = await DocumentClient.scan({
    TableName: TODOS_TABLE_NAME,
    ExclusiveStartKey: exclusiveStartKey,
    Limit: limit,
  }).promise();

  const todos = result.Items;

  let nextToken;
  if (result.LastEvaluatedKey) {
    const json = JSON.stringify(result.LastEvaluatedKey);
    nextToken = Buffer.from(json, "ascii").toString("base64");
  }

  return response(200, { todos, nextToken });
};
