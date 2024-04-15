Kubernetes Architecture
=======================

# Minikube

Start cluster
```
minikube start --nodes=3 --mount --mount-string="<your_local_folder>:/app/datadog-sandbox"
minikube start --nodes=3 --mount --mount-string="/Users/nicolas.narbais/ddproject/datadog-sandbox:/app/datadog-sandbox" --kubernetes-version v1.23.0
```

To see the minikube dashboard
```
minikube dashboard
```

To redirect traffic to localhost
```
minikube tunnel
```

## Deployment with Operator

[Datadog doc](https://docs.datadoghq.com/getting_started/containers/datadog_operator)

For the secrets, follow the instructions below

1. Copy and edit the `datadog_secret.yaml.example`: `cp datadog_secret.yaml.example datadog_secret.yaml`
    1. Add the encoded secrets
1. Deploy the secrets: `kubectl apply -f datadog_secret.yaml`

*Note: You have an error message about PodDisruptionBudget? It looks like in k8s 1.26 it's not policy/v1beta1 but policy/v1.*

Deploy the agent and the monitors:
1. `kubectl apply -f datadog-agent.yaml`
1. `kubectl apply -f datadog-monitors.yaml`

## Check the new resources

```
kubectl get datadogagent
kubectl get datadogmonitor
```

## Edit the operator and see the change

```
kubectl apply -f datadog-agent.yaml
```

## Resources

- doc: https://docs.datadoghq.com/getting_started/containers/datadog_operator - many links at the bottom
- blog post: https://www.datadoghq.com/blog/create-manage-kubernetes-alerts-datadog/
- why an operator https://www.datadoghq.com/blog/datadog-operator/
- operator config v2alpha1 https://github.com/DataDog/datadog-operator/blob/main/docs/configuration.v2alpha1.md
- datadog monitor https://github.com/DataDog/datadog-operator/blob/main/docs/datadog_monitor.md