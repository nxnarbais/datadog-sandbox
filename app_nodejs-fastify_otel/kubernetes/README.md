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

