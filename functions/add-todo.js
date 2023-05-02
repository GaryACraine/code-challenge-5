const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const chance = require('chance').Chance()

const { TODOS_TABLE_NAME } = process.env

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const newTodo = JSON.parse(event.body)
  // do some validation on payload, etc.

  newTodo.id = chance.guid()
  await DocumentClient.put({
    TableName: TODOS_TABLE_NAME,
    Item: newTodo
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(newTodo)
  }
}
