# NodeJS Fastify OTel

## Get Started

### Prep: App

1. Make sure you have NodeJS installed
1. Run `npm i` to install dependencies
1. Run `npm run start` to start the app
  1. Run `curl localhost:3000` to check that everything is working
  1. Stop the app with `CTRL-C`

### Prep: Datadog

1. Make sure docker is installed
1. Copy and edit `.env` file `cp .env.example .env`

### Option 1: Traces in logs

1. Start app: `npm run start-logs`
1. Curl endpoints
1. Observe traces in logs

### Option 2: Traces to Jaegger

1. Start app: `docker compose -f ./docker-conf/docker-compose-app_and_jaeger.yaml up`
1. Curl endpoints
1. Observe traces in Jaeger `http://localhost:16686/`

### Option 3: Traces to OTel to then logs and Jaeger

1. Start app: `docker compose -f ./docker-conf/docker-compose-app_and_jaeger.yaml up`
1. Curl endpoints
1. Observe traces in Jaeger `http://localhost:16686/` and in the logs

*Note: The exporters can be edited in `otel-conf/otel-collector-config-logger_and_jaeger` from for instance `exporters: [logging, jaeger]` to `exporters: [logging, otlphttp]`.*

FIXME: otlphttp exporter is not working

### Option 4: Traces to OTel to then Datadog and Jaeger

1. Start app: `docker compose -f ./docker-conf/docker-compose-app_collector_and_datadog.yaml up`
1. Curl endpoints
1. Observe traces in Jaeger `http://localhost:16686/` and in the logs
1. Observe traces in Datadog `https://app.datadoghq.com/apm/traces?query=%40_top_level%3A1%20service%3Asnoopy` *(Edit extension depending on datacenter)*

### Option 5: Traces (with NGINX) to OTel to then Datadog and Jaeger

1. Go to docker-conf folder and build image `docker build -t nginx-otel --platform linux/amd64 .` - [doc](https://opentelemetry.io/blog/2022/instrument-nginx/)
1. Go back to the main folder
1. Start app: `docker compose -f ./docker-conf/docker-compose-app_collector_and_datadog_with_nginx.yaml up`
1. Curl endpoints
1. Observe traces in Jaeger `http://localhost:16686/` and in the logs
1. Observe traces in Datadog `https://app.datadoghq.com/apm/traces?query=%40_top_level%3A1%20service%3Asnoopy` *(Edit extension depending on datacenter)*

FIXME: NGINX and the nodeapp are not connected

### Option 6: Traces to Datadog as OTLP Collector

1. Start app: `docker compose -f ./docker-conf/docker-compose-app_and_datadog.yaml up`
1. Curl endpoints
1. Observe traces in Datadog `https://app.datadoghq.com/apm/traces?query=%40_top_level%3A1%20service%3Asnoopy` *(Edit extension depending on datacenter)*

## Others

### Endpoints to test

- `curl localhost:3000`
- `curl localhost:3000/route1`
- `curl localhost:3000/route2`
- `curl localhost:3000/route3`

### Jaeger endpoints

- Get started [doc](https://www.jaegertracing.io/docs/1.38/getting-started/)
- [Main endpoint](http://localhost:16686/)
- Metrics [endpoint](http://localhost:8888/metrics)
- Uptime [endpoint](http://localhost:13133/)
- Zpages [endpoints](https://github.com/open-telemetry/opentelemetry-collector/blob/main/extension/zpagesextension/README.md)

### Datadog doc

- OpenTelemetry collector Datadog exporter - [doc](https://docs.datadoghq.com/tracing/trace_collection/open_standards/otel_collector_datadog_exporter/#configuring-the-datadog-exporter)

### Going beyond

- [otel-demo](https://github.com/open-telemetry/opentelemetry-demo)
