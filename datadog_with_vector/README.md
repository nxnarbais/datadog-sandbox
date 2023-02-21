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

For those examples, we will deploy everything within the default namespace.

## Preparation

### Set the secrets

1. Copy and edit the `datadog_secret.yaml.example`: `cp datadog_secret.yaml.example datadog_secret.yaml`
    1. Add the encoded secrets
1. Deploy the secrets: `kubectl -f datadog_secret.yaml`

### Deploy the Datadog Agent

```
helm install datadog -f values-datadog.yaml datadog/datadog
```

[Datadog doc: Helm installation](https://docs.datadoghq.com/containers/kubernetes/installation/?tab=helm)

At this stage, no metric or logs should be reporting to Datadog because the config below has been added to redirect the traffic to Vector.

```
agents:
  useConfigMap: true
  customAgentConfig:
    kubelet_tls_verify: false
    vector:
      logs:
        enabled: true
        url: "http://vector.default:8080"
      metrics:
        enabled: true
        url: "http://vector.default:8080"
```

### To uninstall

- Uninstall Datadog with `helm uninstall datadog`
- Uninstall Vector with `helm uninstall vector`
  - To upgrade with new values `helm upgrade vector vector/vector --values=values-vector.yaml`

## Vector to Datadog

Send randomly generated logs to Datadog.

1. Start Vector: `helm install vector vector/vector --values values-vector-only.yaml`
1. Observe logs in Datadog https://app.datadoghq.com/logs

## Vector with basic log transformations

Parse syslog automatically and edit attributes in some logs.

1. Start Vector: `helm install vector vector/vector --values values-vector-logs_with_transform.yaml`
1. Observe logs in Datadog https://app.datadoghq.com/logs

Note: This is a good place to start learning about VRL, the remap transform is very powerful.

## Vector with logs and metrics

Get all logs and metrics from the agent into Datadog

1. Start Vector: `helm install vector vector/vector --values values-vector-logs_and_metrics.yaml`
1. Observe logs in Datadog https://app.datadoghq.com/logs
1. Observe more hosts reporting in the metric explorer with `sum:system.cpu.idle{*} by {host}`

## Vector with advanced transformation, throttling, monitoring

1. Start Vector: `helm install vector vector/vector --values values-vector.yaml`
1. Observe logs in Datadog https://app.datadoghq.com/logs
1. Observe more hosts reporting in the metric explorer with `sum:system.cpu.idle{*} by {host}`
1. Check the OOTB dashboard to monitor Vector https://app.datadoghq.com/dash/integration/30572 

# Resources

- [More examples](https://github.com/vectordotdev/vector-demos)