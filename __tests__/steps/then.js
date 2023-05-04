const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const todo_exists_in_dynamodb = async (id) => {
  const getRes = await DocumentClient.get({
    TableName: process.env.TODOS_TABLE_NAME,
    Key: {
      id
    }
  }).promise()

  const todo = getRes.Item
  expect(todo).not.toBeNull()

  return todo
}

module.exports = {
  todo_exists_in_dynamodb
}
