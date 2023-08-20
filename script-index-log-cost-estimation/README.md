# Index logs estimation

## Description
Generate a query that will multiple the volume on each index by the actual cost. The customer could then visualize the indexing volume cost.

## Script

Input

- API key
- App key
- Price for each log retention (default: standard pricing)

Output

- Metric query to estimate index cost (potentially to add on the log usage dashboard)

Limitation(s)

- The script has to be run for every update on index (creation or edit)

## How to

1. Create environment with python3 -m venv myenv
1. Activate it source myenv/bin/activate
1. Activate it . myenv/bin/activate
1. Install dependencies
    1. pip install requests
1. Create myscript.py and insert the script below
1. Edit
    1. my_api_key
	1. my_app_key
    1. https://api.datadoghq.com/(if in EU)
1. Edit pricing
    1. custom_log_retention_price
1. Start script python3 myscript.py
1. Copy output into a new datadog widget in a dashboard

```python
import requests
import json

config = {
    "api_key": "my_api_key",
    "app_key": "my_app_key",
    "api_host": "https://api.datadoghq.com/",
}

default_log_retention_price = {
	3: 1.06,
	7: 1.27,
	15: 1.70,
	30: 2.50
}

def get_indexes():
	headers = {
		'DD-API-KEY': config["api_key"],
		'DD-APPLICATION-KEY': config['app_key'],
		'Content-Type': 'application/json'
	}
	params = {}
	url = '{}api/v1/logs/config/indexes'.format(config["api_host"])
	# print("headers:{}".format(headers))
	print("params:{}".format(params))
	print("url:{}".format(url))
	r = requests.get(url, headers=headers, params=params)
	print("status_code:{}".format(r.status_code))
	jsonResponse = r.json()
	return jsonResponse

def get_indexes_with_retention_days():
	indexesByRetentionDays = {}
	for indexMetadata in get_indexes().get("indexes"):
		num_retention_days = indexMetadata.get("num_retention_days")
		if indexesByRetentionDays.get(num_retention_days) is None:
			indexesByRetentionDays[num_retention_days] = []
		indexesByRetentionDays[num_retention_days].append(indexMetadata.get("name"))
	return indexesByRetentionDays


def get_query_filter_for_indexes():
	indexesByRetentionDays = get_indexes_with_retention_days()
	filterByRetentionDays = {}
	for key, value in indexesByRetentionDays.items():
		datadog_indexes = 'datadog_index IN ({})'.format(", ".join(value))
		filterByRetentionDays[key] = f'sum:datadog.estimated_usage.logs.ingested_events{{datadog_is_excluded:false AND {datadog_indexes} }}.as_count()'
	return filterByRetentionDays

def generate_JSON(log_retention_price = default_log_retention_price):
	filterByRetentionDays = get_query_filter_for_indexes()
	print(filterByRetentionDays)
	queries = []
	formula = ""
	for key, value in filterByRetentionDays.items():
		queries.append({
			"query": value,
			"data_source": "metrics",
			"name": 'retention{}'.format(key),
			"aggregator": "sum"
		})
		if log_retention_price.get(key) is not None:
			if formula != "":
				formula += " + "
			formula += '{} * {}'.format(
				log_retention_price.get(key),
				'retention{}'.format(key),
			)
		else:
			print("ERROR: Price not found for retention {}. The formula will be inaccurate.".format(key))
	jsonQuery = {
		"viz": "query_value",
		"requests": [{
			"formulas": [
                {
                    "formula": f'({formula}) / 1000000'
                }
            ],
            "response_format": "scalar",
            "queries": queries
		}],
		"autoscale": True,
		"custom_unit": "$",
		"precision": 2,
		"timeseries_background": {
			"type": "bars"
		}
	}
	return jsonQuery

custom_log_retention_price = {
	3: 1.23,
	7: 2.34,
	8: 4.56,
	15: 5.67,
	30: 7.89,
	60: 8.90
}

jsonQuery = generate_JSON(custom_log_retention_price)
print(json.dumps(jsonQuery, indent=4, sort_keys=True))
```