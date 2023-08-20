// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const axios = require('axios')
const http = require('node:http');

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.get('/route1', async (request, reply) => {
  const url = 'http://backend-app2-service.default.svc:8080'
  try {
    const response = await axios.get(url)
    return { route: '1', url, responseData: response.data }
  } catch (err) {
    fastify.log.error(err)
    return err
  }
})

fastify.get('/route2', async (request, reply) => {
  const url = 'http://backend-app2-service.default.svc:8080/do-something'
  try {
    const response = await axios.get(url)
    return { route: '2', url, responseData: response.data }
  } catch (err) {
    fastify.log.error(err)
    return err
  }
})

fastify.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
