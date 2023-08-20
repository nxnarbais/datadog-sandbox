# OpenMetrics

This sandbox is intended to be used to better understand the syntax difference between histogram and distribution metrics.

## Get started

### Setup an environment

In this folder set the `.env` file with relevant variables. Check `.env.example` for reference.

Start the Prometheus container and the containerize Datadog agent:

```
docker-compose up
```

*Note*: To take the cluster down `docker-compose down`

### Setup distribution metrics

At that point, you should be able to see [distribution metrics](https://app.datadoghq.com/metric/distribution_metrics) in your org. The default distribution metrics are:

```
distrib.prometheus_http_request_duration_seconds
distrib.prometheus_http_response_size_bytes
```

Click on `Add Percentile Aggregation`, select your metric `distrib.prometheus_http_response_size_bytes` and apply tag `handler`.

### Setup your dashboard

Import the dashboard from this directory: `timeboard.json`

### Generate some data

Generate some traffic

```
./generate-traffic.sh 10
```

Where `10` is the maximum number of seconds the script will wait until the next execution. You can set it between 2 and 30 seconds to generate different quantity of traffic.

## Prometheus

To graph the metrics within Prometheus, go to the endpoint below.

http://localhost:9090/graph

To see the raw endpoint to get the metrics, go to the endpoint below.

http://localhost:9090/metrics

To generate a spike, refresh the `/metrics` page. The spike will appear on `distrib.prometheus_http_response_size_bytes`

## Metric selection

In this example, all metrics from the Prometheus endpoints are collected. It is possible to select a subset of metrics only. The integration uses the `fnmatch` function to achieve that.

The script `fnmatch-script.py` in this folder can help you get started to identify the right metric selector.

## Syntax migration

In a few lines, migrating from histograms to distribution metrics can be complicated since the syntax change completely.

For instance:
```
histograms: diff(sum:<my_metric>.count{upper_bound:1000})
distribution: count:<my_metric>{upper_bound:1000}
```

In addition, the count in histograms is cumulative and not in distribution.

For a more detailed presentation check [these slides](https://docs.google.com/presentation/d/1TYmy37IFOX7T8CXW_WwdxHSvPHdjOX3kKq0nFhIEiUs/edit).

## Monotonic counter

For this specific part, uncomment the `python_app` container in the `docker-compose.yaml` file. This will generate two new metrics `counter.request_random_counter_total` and `counter_monotonic.request_random_counter_total`.

Quick notes on those metrics:
- `counter.request_random_counter_total` is of type `gauge`. Some actions have to be taken with `.fill(null)` and `.rollup(sum)` to observe relevant data in a chart
- `counter_monotonic.request_random_counter_total` is of type `count`

To observe the difference of collection, here are two widgets of interest:
```
{
    "viz": "timeseries",
    "requests": [
        {
            "q": "sum:counter.request_random_counter_total{*}, cumsum(sum:counter_monotonic.request_random_counter_total{*}.as_count())",
            "type": "line",
            "style": {
                "palette": "dog_classic",
                "type": "solid",
                "width": "normal"
            }
        }
    ],
    "yaxis": {
        "scale": "linear",
        "min": "auto",
        "max": "auto",
        "includeZero": true,
        "label": ""
    },
    "markers": []
}
```
and
```
{
    "viz": "timeseries",
    "requests": [
        {
            "q": "diff(sum:counter.request_random_counter_total{*}), sum:counter_monotonic.request_random_counter_total{*}.as_count()/15",
            "type": "line",
            "style": {
                "palette": "dog_classic",
                "type": "solid",
                "width": "normal"
            }
        }
    ],
    "yaxis": {
        "scale": "linear",
        "min": "auto",
        "max": "auto",
        "includeZero": true,
        "label": ""
    },
    "markers": []
}
```
