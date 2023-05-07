/**
 * Add-Todo test
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

describe('Given an authorized user', () => {
  let user
  const todo = {
    id: chance.guid(),
    reminder: chance.string({ length: 16 }),
    completed: false
  }

  beforeAll(async () => {
    await given.todo_exists_in_dynamodb(todo)

    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
    }
  })

  it('PUT /todos should update a todo, marking as complete', async () => {
    const updatedTodo = {
      id: todo.id,
      reminder: todo.reminder,
      completed: true
  }
    const result = await when.we_invoke_update_todo(updatedTodo, user)

    expect(result.statusCode).toEqual(200)
    // expect(result.body.id).not.toBeNull()
    expect(result.body).toMatchObject(updatedTodo)

    // todo.id = result.body.id
    // await then.todo_exists_in_dynamodb(todoId)
  })

})
