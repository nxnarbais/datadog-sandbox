// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request, reply) => {
    return { hello: 'world', step: 'The cake is a lie' }
})
  
  
fastify.get('/do-something', async (request, reply) => {
    return { route: 'do-something', step: 'Did some hard work.' }
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