const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();
const chance = require("chance").Chance();
const { response } = require("../lib/http_help");

const { TODOS_TABLE_NAME } = process.env;

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const newTodo = JSON.parse(event.body);
  // const { username } = event.identity
  if (!newTodo.reminder) {
    return response(500, { message: "Error deleting item" });
  }

  newTodo.id = chance.guid();
  // newTodo.username = username

  await DocumentClient.put({
    TableName: TODOS_TABLE_NAME,
    Item: newTodo,
  }).promise();

  return response(200, newTodo);
};
