/**
 * List-Testaurants test
 *
 * @group integration
 * @group e2e
 */

require('../steps/init')
const given = require('../steps/given')
const when = require('../steps/when')
const then = require('../steps/then')
const chance = require('chance').Chance()

const { TEST_MODE } = process.env

describe('Given at least one todo is in the database', () => {
  const todo = {
    id: chance.guid(),
    name: chance.string({ length: 16 }),
    completed: false
  }
  let user

  beforeAll(async () => {
    await given.todo_exists_in_dynamodb(todo)

    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
    }
  })

  it('DELETE /todos should remove this todo from the database', async () => {
    const result = await when.we_invoke_delete_todo(todo.id, user)
    console.log(result)
    expect(result.statusCode).toEqual(200)
    expect(result.body.message).toEqual("Item deleted successfully")

    await then.todo_not_exists_in_dynamodb(todo.id)
  })
})
