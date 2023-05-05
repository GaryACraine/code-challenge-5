/**
 * List-Testaurants test
 *
 * @group integration
 * @group e2e
 */

require('../steps/init')
const given = require('../steps/given')
const when = require('../steps/when')
const chance = require('chance').Chance()

const { TEST_MODE } = process.env

describe('Given at least one todo is in the database', () => {
  const todo = {
    id: chance.guid(),
    name: chance.string({ length: 16 })
  }
  let user

  beforeAll(async () => {
    await given.todo_exists_in_dynamodb(todo)

    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
    }
  })

  it('GET /todos should return at least one todo', async () => {
    const result = await when.we_invoke_list_todos(1, null, user)

    expect(result.statusCode).toEqual(200)
    expect(result.body.todos).toHaveLength(1)
  })
})

describe('Given at least two todos in the database', () => {
  let user

  beforeAll(async () => {
    await given.todo_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })

    await given.todo_exists_in_dynamodb({
      id: chance.guid(),
      name: chance.string({ length: 16 })
    })

    if (TEST_MODE === 'e2e') {
      user = await given.an_authenticated_user()
    }
  })

  it('list-todos with count of 1 should return a nextToken', async () => {
    const result = await when.we_invoke_list_todos(1, null, user)

    expect(result.statusCode).toEqual(200)
    expect(result.body.todos).toHaveLength(1)
    expect(result.body.nextToken).not.toBeUndefined()
  })

  it ('list-todos can paginate with nextToken', async () => {
    const result1 = await when.we_invoke_list_todos(1, null, user)
    const { nextToken } = result1.body
    const result2 = await when.we_invoke_list_todos(1, nextToken, user)
    expect(result2.statusCode).toEqual(200)
    expect(result2.body.todos).toHaveLength(1)

    const todos1 = result1.body.todos[0]
    const todos2 = result2.body.todos[0]
    expect(todos1.id).not.toEqual(todos2.id)
  })
})
