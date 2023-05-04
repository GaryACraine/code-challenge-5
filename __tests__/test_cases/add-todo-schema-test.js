/**
 * Add-Restaurant schema validation test
 *
 * @group e2e
 */

require('../steps/init')
const when = require('../steps/when')

describe('Given an anonymous user', () => {
  it('POST /todos should return 400 if "name" is missing', async () => {
    const result = await when.we_invoke_add_todo({ })

    expect(result.statusCode).toEqual(400)
  })

  it('POST /todos should return 400 if "name" is null', async () => {
    const result = await when.we_invoke_add_todo({ name: null })

    expect(result.statusCode).toEqual(400)
  })
})
