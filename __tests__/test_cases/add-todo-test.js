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
  const todoName = chance.string({ length: 16 })
  let todoId

  beforeAll(async () => {
    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
      // console.log(user)
    }
  })

  it('POST /todos should add a todo', async () => {
    const todo = { name: todoName }
    const result = await when.we_invoke_add_todo(todo, user)

    expect(result.statusCode).toEqual(200)
    expect(result.body.id).not.toBeNull()
    expect(result.body).toMatchObject(todo)

    todoId = result.body.id
    await then.todo_exists_in_dynamodb(todoId)
  })

  it('POST /todos should return 400 if "name" is missing', async () => {
    const result = await when.we_invoke_add_todo({ }, user)

    expect(result.statusCode).toEqual(500)
  })

  it('POST /todos should return 400 if "name" is null', async () => {
    const result = await when.we_invoke_add_todo({ name: null }, user)

    expect(result.statusCode).toEqual(500)
  })



})
