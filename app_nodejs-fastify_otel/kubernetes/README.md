Kubernetes Architecture
=======================

# Minikube

Start cluster
```
minikube start --nodes=3 --mount --mount-string="<your_local_folder>:/app/datadog-sandbox"
minikube start --nodes=3 --mount --mount-string="/Users/nicolas.narbais/ddproject/datadog-sandbox:/app/datadog-sandbox"
```

To see the minikube dashboard
```
minikube dashboard
```

To redirect traffic to localhost
```
minikube tunnel
```

# Deploy

## Traces to Jaegger

This example shows the raw traces going directly from the application OTel SDK to Jaeger.

1. Start app: `kubectl -f app_with_jaeger.yaml`
1. Curl endpoints: `curl localhost:3000/route1`
1. Observe traces in Jaeger `http://localhost:3030/`

To delete `kubectl delete -f app_with_jaeger.yaml`

## Traces to an OTel Gateway then to Jaegger

This example presents the common OTel architecture with one OTel Gateway collecting all traces from a cluster and forwarding that to an external solution (here Jaeger).

1. Start app: `kubectl -f app_with_otel_gateway_and_jaeger.yaml`
1. Curl endpoints: `curl localhost:3000/route1`
1. Observe traces in Jaeger `http://localhost:3030/`

To delete: `kubectl delete -f app_with_otel_gateway_and_jaeger.yaml`

To see the OTel collector logs: `kubectl logs -f pod/<otel_pod_id>`

## Traces to an OTel agent then to an OTel Gateway then to Jaegger

This example presents the common OTel architecture with an OTel agent deployed as a daemonset and one OTel Gateway collecting. All traces are sent to the OTel agent on the same host which then forward the traces to the OTel Gateway. The OTel Gateway then forward everything to an external solution (here Jaeger).

1. Start app: `kubectl -f app_with_otel_agent_and_jaeger.yaml`
1. Curl endpoints: `curl localhost:3000/route1`
1. Observe traces in Jaeger `http://localhost:3030/`

To delete: `kubectl delete -f app_with_otel_agent_and_jaeger.yaml`

To see the OTel collector logs: `kubectl logs -f pod/<otel_pod_id>`

Note: The structure for the deployment of OTel has been taken from the [OTel doc](https://opentelemetry.io/docs/collector/getting-started/#kubernetes).

## OpenTelemetry Collector Datadog Exporter

[Datadog doc](https://docs.datadoghq.com/opentelemetry/otel_collector_datadog_exporter/?tab=onahost)

1. Copy and edit the `datadog_secret.yaml.example`: `cp datadog_secret.yaml.example datadog_secret.yaml`
    1. Add the encoded secrets
1. Deploy the secrets: `kubectl -f datadog_secret.yaml`
1. Start app: `kubectl -f app_with_otel_gateway_and_datadog.yaml`
1. Curl endpoints: `curl localhost:3000/route1`
1. Observe traces in Jaeger `http://localhost:3030/`

To delete: `kubectl delete -f app_with_otel_gateway_and_datadog.yaml`

To see the traces in Datadog, go to the [Trace live search](https://app.datadoghq.com/apm/traces?query=%40_top_level%3A1%20-env%3Aprod)

Go further and connect logs, rum and synthetics with APM ([doc](https://docs.datadoghq.com/tracing/other_telemetry/)).

## Traces to an OTel agent then to an OTel Gateway then to Datadog

[Datadog doc](https://docs.datadoghq.com/opentelemetry/otel_collector_datadog_exporter/?tab=onahost)

1. Copy and edit the `datadog_secret.yaml.example`: `cp datadog_secret.yaml.example datadog_secret.yaml`
    1. Add the encoded secrets
1. Deploy the secrets: `kubectl -f datadog_secret.yaml`
1. Start app: `kubectl -f app_with_otel_agent_and_datadog.yaml`
1. Curl endpoints: `curl localhost:3000/route1`
1. Observe traces in Jaeger `http://localhost:3030/`

To delete: `kubectl delete -f app_with_otel_agent_and_datadog.yaml`

To see the traces in Datadog, go to the [Trace live search](https://app.datadoghq.com/apm/traces?query=%40_top_level%3A1%20-env%3Aprod)

Go further and connect logs, rum and synthetics with APM ([doc](https://docs.datadoghq.com/tracing/other_telemetry/)).

FIXME: Get the metrics from the OTel agents to be forwarded to the OTel Collector

## OTel with the Datadog Agent

### Install the Datadog Agent on the cluster

[Datadog doc](https://docs.datadoghq.com/containers/kubernetes/installation/)

```
helm install <RELEASE_NAME> -f values.yaml  --set datadog.apiKey=<DATADOG_API_KEY> datadog/datadog --set targetSystem=<TARGET_SYSTEM>
```

Iterate on your `values.yaml` with
```
helm upgrade <RELEASE_NAME> -f values.yaml --set datadog.apiKey=<DATADOG_API_KEY> datadog/datadog
```

Uninstall release
```
helm uninstall <RELEASE_NAME>
```

### OTLP ingestion by the Datadog Agent

[Datadog doc](https://docs.datadoghq.com/opentelemetry/otlp_ingest_in_the_agent/?tab=host).

1. Start the Datadog agent with otlp receiver enabled
1. Start app: `kubectl -f app_with_datadog.yaml`
1. Curl endpoints: `curl localhost:3000/route1`
1. Observe traces in Jaeger `http://localhost:3030/`

To delete: `kubectl delete -f app_with_datadog.yaml`

Go further and connect logs, rum and synthetics with APM ([doc](https://docs.datadoghq.com/tracing/other_telemetry/)).
