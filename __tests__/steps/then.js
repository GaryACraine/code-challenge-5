const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const todo_exists_in_dynamodb = async (id) => {
  const getRes = await DocumentClient.get({
    TableName: process.env.TODOS_TABLE_NAME,
    Key: {
      id,
    },
  }).promise();

  const todo = getRes.Item;
  expect(todo).not.toBeNull();

  return todo;
};

const todo_not_exists_in_dynamodb = async (id) => {
  const getRes = await DocumentClient.get({
    TableName: process.env.TODOS_TABLE_NAME,
    Key: {
      id,
    },
  }).promise();
  // console.log(getRes);
  expect(getRes.Item).toBeUndefined();

  return;
};

module.exports = {
  todo_exists_in_dynamodb,
  todo_not_exists_in_dynamodb,
};
