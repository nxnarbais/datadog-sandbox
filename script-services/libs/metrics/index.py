import requests
import json
import re
import time

ENDPOINT = {
  "metric_search": "api/v1/search",
  "metric_query": "api/v1/query"
}

def search_metrics(config, query):
  print("START - search_metrics - query:" + query)
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  params = {
      'q': 'metrics:{}'.format(query)
  }
  url = '{}{}'.format(config["api_host"], ENDPOINT["metric_search"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  return jsonResponse

def query_timeserie_points(config, metric_query):
  print("START - query_timeserie_points - metric_query:" + metric_query)
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  current_time = int(time.time())
  days = 15
  params = {
      'query': metric_query,
      'from': current_time - 60 * 60 * 24 * days,
      'to': current_time
  }
  url = '{}{}'.format(config["api_host"], ENDPOINT["metric_query"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  # print(jsonResponse)
  return jsonResponse

def search_trace_hits_metrics(config):
  metrics = search_metrics(config, 'trace.').get('results', {}).get('metrics', [])
  res = {}
  for m in metrics:
    pattern = re.compile(".*\.hits$")
    if pattern.match(m):
      res[m] = res.get(m, 0) + 1
  resArr = []
  for attr, value in res.items():
    resArr.append(attr)
  # print("search_trace_hits_metrics DONE")
  return resArr

def get_tag_values_for_metric(config, metric_name, tags):
  print("START - get_tag_values_for_metric - metric_name:" + metric_name + ", tags: " + ','.join(tags))
  metric_query = metric_name + '{*} by {' + ','.join(tags) + '}'
  # print(metric_query)
  timeserie_points = query_timeserie_points(config, metric_query)
  series = timeserie_points.get('series', [])
  tag_combinations = []
  for s in series:
    expression = s.get('expression', '')
    tag_values = re.search('\{(.*)\}', expression)
    tag_combinations.append(tag_values[0])
  return tag_combinations

def get_services(config, tagKeys = ['env', 'service']):
  metrics = search_trace_hits_metrics(config)
  res = {}
  # for m in metrics[0:1]:
  for m in metrics:
    tags = get_tag_values_for_metric(config, m, tagKeys)
    # print("Tags extracted for m:{}, tags:{}".format(m, tags))
    for t in tags:
      intermediaryRes = ""
      firstTagKey = True
      for tk in tagKeys:
        regexStr = "[,{]" + tk + ":([a-zA-Z0-9_:./-]*)[},]"
        tagValueSearch = re.search(regexStr, t)
        # print("Result of re.search for t:{}, tk: {}, res:{}".format(t, tk, tagValueSearch))
        if tagValueSearch is not None:
          tagValue = tagValueSearch[1]
          if not firstTagKey:
            intermediaryRes += "__"
          else:
            firstTagKey = False
          intermediaryRes += tagValue
        else:
          print("ERROR on result of re.search for t:{}, tk: {}, res:{}".format(t, tk, tagValueSearch))
      res[intermediaryRes] = res.get('service', 0) + 1
  resArr = []
  for attr, value in res.items():
    resArr.append(attr)
  # print("get_services DONE")
  return resArr