Kubernetes Architecture
=======================

# Minikube

Start cluster
```
minikube start --nodes=3 --mount --mount-string="<your_local_folder>:/app/datadog-sandbox"
```

For instance:
```
minikube start --nodes=3 --mount --mount-string="/Users/nicolas.narbais/ddproject/datadog-sandbox:/app/datadog-sandbox"
```

To see the minikube dashboard
```
minikube dashboard
```

To redirect traffic to localhost
```
minikube tunnel --clean
```

# Deploy

### Prep: App

1. Make sure you have NodeJS installed
1. Run `npm i` to install dependencies on the folder `app1` and on the folder `app2`
1. Run `npm run start` to start the app in each folder to see if things are working well
  1. Run `curl localhost:3000` to check that everything is working
  1. Stop the app with `CTRL-C`

### Prep: Deploy Datadog

1. Copy and edit the `datadog_secret.yaml.example`: `cp datadog_secret.yaml.example datadog_secret.yaml`
    1. Add the encoded secrets
1. Deploy the secrets: `kubectl apply -f datadog_secret.yaml`
1. Deploy the agent following the helm chart doc

### Deploy the app

1. Run `kubectl apply -f app_deployment.yaml`
