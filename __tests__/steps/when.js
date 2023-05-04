const APP_ROOT = '../../'
// const AWS = require('aws-sdk')
// const ApiGateway = new AWS.APIGateway()
// const aws4 = require('aws4')
// const URL = require('url')
const http = require('axios')

const { TEST_MODE } = process.env


const viaHandler = async (event, functionName) => {
  const handler = require(`${APP_ROOT}/functions/${functionName}`).handler

  const context = {}
  const response = await handler(event, context)
  const headers = response?.headers || {}
  const contentType = headers['content-type'] || 'application/json'
  if (response?.body && contentType === 'application/json') {
    response.body = JSON.parse(response.body)
  }
  return response
}

const viaHttp = async (relPath, method, opts) => {
  const url = `${process.env.ApiUrl}/${relPath}`
  console.info(`invoking via HTTP ${method} ${url}`)

  try {
    let headers = {}
    const data = opts?.body
    if (data) {
      headers['Content-Type'] = 'application/json'
    }

    if ((opts?.iam_auth || false) === true) {
      headers = signHttpRequest(url, method, headers, data)
    }

    const authHeader = opts?.auth
    if (authHeader) {
      headers.Authorization = authHeader
    }

    if ((opts?.api_key || false) == true) {
      headers['x-api-key'] = await getApiKey()
    }

    const httpReq = http.request({
      method, url, headers, data
    })

    const res = await httpReq
    return {
      statusCode: res.status,
      body: res.data,
      headers: res.headers
    }
  } catch (err) {
    if (err.response?.status) {
      return {
        statusCode: err.response.status,
        headers: err.response.headers
      }
    } else {
      throw err
    }
  }
}

const we_invoke_add_todo = async (todo) => {
  const body = JSON.stringify(todo)
  switch (TEST_MODE) {
    case 'integration':
      return await viaHandler({ body }, 'add-todo')
    case 'e2e':
      // return await viaHttp('todos', 'POST', { body, iam_auth: true })
      return await viaHttp('todos', 'POST', { body })
    default:
      throw new Error(`TEST_MODE [${TEST_MODE}] is not supported`)
  }
}


module.exports = {
  we_invoke_add_todo
}
