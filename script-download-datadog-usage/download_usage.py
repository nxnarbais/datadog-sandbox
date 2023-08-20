import requests
import json
from datetime import datetime
import time

config = {
    "api_key": "my_api_key",
    "app_key": "my_app_key",
    "api_host": "https://api.datadoghq.com/",
}

TAG_BREAKDOWN = "team"

# API Doc: https://docs.datadoghq.com/api/latest/usage-metering/#get-monthly-usage-attribution
def get_monthly_usage_attribution():
  today = datetime.today()
  year = today.year
  month = today.month
  start_month = "{}-{}".format(year,f'{month:02d}')
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key'],
      'Content-Type': 'application/json'
  }
  params = {
      'start_month': start_month,
      'fields': '*',
      'tag_breakdown_keys': TAG_BREAKDOWN
  }
  url = '{}api/v1/usage/monthly-attribution'.format(config["api_host"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  return jsonResponse

# _______________________________________

def sum_pointlist(pointlist):
  sum = 0
  for p in pointlist:
    if p[1] is not None:
      sum = p[1]
  return sum

def get_log_usage_ingested_this_month():
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  metric_query = "sum:datadog.estimated_usage.logs.ingested_bytes{*} by {service}"
  current_time = int(time.time())
  first_day_of_month = int(datetime.today().replace(day=1).timestamp())
  params = {
      'query': metric_query,
      'from': first_day_of_month,
      'to': current_time
  }
  url = '{}api/v1/query'.format(config["api_host"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  print("query_timeserie_points DONE - metric_query:" + metric_query)
  series = jsonResponse.get("series", [])
  res = {}
  for s in series:
    res["__".join(s.get("tag_set",[]))] = sum_pointlist(s.get("pointlist", []))
  # return jsonResponse
  return res

def get_log_usage_indexed_this_month():
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  metric_query = "sum:datadog.estimated_usage.logs.ingested_events{datadog_is_excluded:false} by {service}"
  current_time = int(time.time())
  first_day_of_month = int(datetime.today().replace(day=1).timestamp())
  params = {
      'query': metric_query,
      'from': first_day_of_month,
      'to': current_time
  }
  url = '{}api/v1/query'.format(config["api_host"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  print("query_timeserie_points DONE - metric_query:" + metric_query)
  series = jsonResponse.get("series", [])
  res = {}
  for s in series:
    res["__".join(s.get("tag_set",[]))] = sum_pointlist(s.get("pointlist", []))
  # return jsonResponse
  return res

def get_apm_usage_ingested_this_month():
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  metric_query = "sum:datadog.estimated_usage.apm.ingested_bytes{*} by {env}"
  current_time = int(time.time())
  first_day_of_month = int(datetime.today().replace(day=1).timestamp())
  params = {
      'query': metric_query,
      'from': first_day_of_month,
      'to': current_time
  }
  url = '{}api/v1/query'.format(config["api_host"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  print("query_timeserie_points DONE - metric_query:" + metric_query)
  series = jsonResponse.get("series", [])
  res = {}
  for s in series:
    res["__".join(s.get("tag_set",[]))] = sum_pointlist(s.get("pointlist", []))
  # return jsonResponse
  return res

def get_apm_usage_indexed_this_month():
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  metric_query = "sum:datadog.estimated_usage.apm.ingested_spans{*} by {env}"
  current_time = int(time.time())
  first_day_of_month = int(datetime.today().replace(day=1).timestamp())
  params = {
      'query': metric_query,
      'from': first_day_of_month,
      'to': current_time
  }
  url = '{}api/v1/query'.format(config["api_host"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  print("query_timeserie_points DONE - metric_query:" + metric_query)
  series = jsonResponse.get("series", [])
  res = {}
  for s in series:
    res["__".join(s.get("tag_set",[]))] = sum_pointlist(s.get("pointlist", []))
  # return jsonResponse
  return res

def get_hourly_logs_per_index():
  # timestamp = time.time()
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key'],
      'Content-Type': 'application/json'
  }
  params = {
      'start_hr': '2022-03-20T00',
      # 'end_hr': '*',
      # 'index_name': 'team'
  }
  url = '{}api/v1/usage/logs_by_index'.format(config["api_host"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  return jsonResponse

res = {
	"usage_attribution": get_monthly_usage_attribution(),
	"ingested_logs": get_log_usage_ingested_this_month(),
	"indexed_logs": get_log_usage_indexed_this_month(),
	"ingested_spans": get_apm_usage_ingested_this_month(),
	"indexed_spans": get_apm_usage_indexed_this_month(),
}

print(json.dumps(res, indent=4, sort_keys=True))

hourly_usage = get_hourly_logs_per_index()
for usage in hourly_usage.get("usage", []):
  print('index:{} event_count:{} hour:{}'.format(
      usage.get("index_name"),
      usage.get("event_count"),
      usage.get("hour")))