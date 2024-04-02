Wordpress monitored with Datadog
================================

## Get started

### Start minikube

Start cluster
```
minikube start --nodes=3 --mount --mount-string="<your_local_folder>:/app/"
```

For instance:
```
minikube start --nodes=3 --mount --mount-string="$HOME/pproject/myapps_deployment/datadog_wordpress_k8s:/app"
```

To see the minikube dashboard
```
minikube dashboard
```

To redirect traffic to localhost
```
minikube tunnel --clean
```

### Wordpress deployment

[Kubernetes doc](https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

https://minikube.sigs.k8s.io/docs/handbook/accessing/
```
minikube service wordpress --url # will not have the right port
minikube tunnel
minikube service wordpress-phpmyadmin --url
```

### Datadog instrumentation

#### MySQL

[Doc | MySQL integration](https://docs.datadoghq.com/fr/integrations/mysql/)
[Doc | MySQL DBM](https://docs.datadoghq.com/database_monitoring/setup_mysql/selfhosted?tab=mysql57)

1. Connect to container `kubectl exec -it <POD_NAME> -- /bin/bash`
1. Create user
1. Add annotations

```
kubectl get secret mysql-pass -o jsonpath="{.data.password}" | base64 --decode
kubectl exec -it <POD_NAME> -- /bin/bash
kubectl exec -it <POD_NAME> -- mysql -u wordpress -p # YOUR_PASSWORD
kubectl exec -it <POD_NAME> -- mysql -u root -p # YOUR_PASSWORD
```

```
minikube image pull wordpress:6.2.1-apache
```

```
mysql -u datadog --password=YOUR_PASSWORD -e "show status" | \
grep Uptime && echo -e "\033[0;32mMySQL user - OK\033[0m" || \
echo -e "\033[0;31mCannot connect to MySQL\033[0m"
```

```
mysql -u datadog --password=YOUR_PASSWORD -e "show slave status" && \
echo -e "\033[0;32mMySQL grant - OK\033[0m" || \
echo -e "\033[0;31mMissing REPLICATION CLIENT grant\033[0m"
```

#### APM

[Doc | APM for PHP](https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/php/#install-the-extension)

```
docker build -t wordpress-apm -f ./Dockerfile
minikube image load wordpress-apm
minikube image ls --format table
```

Edit `wordpress-deployment.yaml` with:

1. New image name
1. Additional annotations and env

### Troubleshooting

* Why is the data kept upon restart?
    * [Reddit thread](https://www.reddit.com/r/kubernetes/comments/ujjwil/persistent_volume_data_not_getting_deleted_post/?rdt=60872)