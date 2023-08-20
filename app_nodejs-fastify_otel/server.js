// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
// const https = require('https');
const axios = require('axios');
const opentelemetry = require("@opentelemetry/api");
// const { trace } = require('console');

const getTracer = () => (opentelemetry.trace.getTracer(
  'my-service-tracer'
))

fastify.get('/', async (request, reply) => {
  const tracer = getTracer()

  const doWork = (i) => {
    tracer.startActiveSpan(`doWork:${i}`, span => {
      // simulate some random work.
      const random_number = Math.floor(Math.random() * 40000000)
      for (let i = 0; i <= random_number; i += 1) {
        // empty
        span.setAttribute('random_number', random_number);
      }
      span.addEvent('Doing some real work here'); // Span event
      // Make sure to end this child span! If you don't,
      // it will continue to track work beyond 'doWork'!
      span.end();
    });
  }

  // Create a span. A span must be closed.
  tracer.startActiveSpan(
    'home_process_span', 
    { attributes: { custom_attribute: 'value1' }},
    span => {
      for (let i = 0; i < 10; i += 1) {
        doWork(i)
      }
      // Be sure to end the span!
      span.end();
    }
  );

  tracer.startActiveSpan('home_parallel_process_span', span => {
    Promise.all([doWork(100), doWork(200)]).then(() => {
      span.end();
    });
  })

  return { hello: 'world' }
})

// This will add the location as an attribute of the span
// This attribute can be made searchable on Trace Search and Analytics
// since it is set on the root span
const addSpanWithLocation = (location) => {
  // UNCOMMENT #2
  const activeSpan = opentelemetry.trace.getActiveSpan();
  if (activeSpan) {
    activeSpan.setAttribute('location-childspan', location);
  }
  // TODO: Set attribute on parent span
  // const context = activeSpan.getSpanContext()
};

const callToExternalService = () => { return { list: ["rantanplan","idefix"], total_count: 300, page: 1} };
const processSomething = async () => {
  let resProcessed = undefined

  // UNCOMMENT #3
  const tracer = getTracer()
  resProcessed = tracer.startActiveSpan('process.something', async span => {
      const resProcessed = await callToExternalService();
      const resProcessedStr = JSON.stringify(resProcessed);
      // TODO: Check how to add a JSON as attribute
      // span.setAttributes({result: resProcessed});
      span.setAttribute('resultstr', resProcessedStr);
      span.end();
      return resProcessed
    }
  );

  return resProcessed
}

const callToAuthService = (userToken) => {
  const someWork = () => {
    const random_number = Math.floor(Math.random() * 40000000)
    for (let i = 0; i <= random_number; i += 1) {
      // empty
    }
  }
  someWork()
  if (userToken > 3) {
    throw new Error('Invalid auth query');
  }
  return { userId: userToken + 42 }
}
const authenticateWithToken = async (userToken) => {
  let userDetails = undefined
  // UNCOMMENT #4
  // const traceOptions = {
  //   service: "fake_auth_service",
  //   resource: "fake_auth_service.verify_id_token",
  // };
  // userDetails = await tracer.trace('user.autentication', traceOptions, async () => {
  //   const userDetails = await callToAuthService(userToken);
  //   const activeSpan = tracer.scope().active();
  //   activeSpan.setTag('user', userDetails);
  //   return userDetails;
  // });


  const tracer = getTracer()
  await tracer.startActiveSpan('external_call', async span => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    span.setAttribute("title", response.data.title || 'default_value_in_case_of_error')
    span.end()
  })

  userDetails = await tracer.startActiveSpan('user.authentication', async parentSpan => {
    let res = {}
    try {
      res = await tracer.startActiveSpan(
        'fake_auth_service.verify_id_token', 
        { attributes: { 'service.name': 'fake_auth_service' } },
        async span => {
          let details = {}
          try {
            details = await callToAuthService(userToken);
            span.setAttribute('user', JSON.stringify(details));
          } catch (err) {
            span.recordException(err);
            span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
            throw new Error('User does not exist');
          } finally {
            span.end()
          }
          return details
        }
      )
    } catch(err) {
      parentSpan.recordException(err);
      parentSpan.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
      throw new Error('Cannot authenticate');
    } finally {
      parentSpan.end()
    }
    return res;
  });
  
  return userDetails
}

fastify.get('/route1', async (request, reply) => {
  addSpanWithLocation("Paris")
  const resProcessed = await processSomething()
  request.log.info("Result from external service " + JSON.stringify(resProcessed));
  return { route: '1' }
})

fastify.get('/route2', async (request, reply) => {
  addSpanWithLocation("Berlin")
  const userDetails = await authenticateWithToken(1)
  request.log.info("Authentication " + JSON.stringify(userDetails));
  return { route: '2' }
})

fastify.get('/route3', async (request, reply) => {
  addSpanWithLocation("Cairo")
  const userDetails = await authenticateWithToken(10)
  request.log.info("Authentication " + JSON.stringify(userDetails));
  return { route: '3' }
})

fastify.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

// Run the server!
const start = async () => {
  try {
    // await fastify.listen(3000)
    await fastify.listen(3000, '0.0.0.0') // Add 0.0.0.0 for Docker
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()