import requests
import json
# import re
# import time
from libs.monitors.scoring import analyze_monitor

ENDPOINT = {
  "monitors": "api/v1/monitor",
}

def get_all_monitors(config):
  print("START - get_all_monitors")
  headers = {
      'DD-API-KEY': config["api_key"],
      'DD-APPLICATION-KEY': config['app_key']
  }
  params = {}
  url = '{}{}'.format(config["api_host"], ENDPOINT["monitors"])
  # print(headers)
  # print(params)
  # print(url)
  r = requests.get(url, headers=headers, params=params)
  jsonResponse = r.json()
  print(jsonResponse)
  return jsonResponse

def get_all_monitors_analyzed(config):
  monitors = get_all_monitors(config)
  options = {
    "past_days": 15,
    "muted_past_days": 30,
    "regex_string_cloud_metrics": ".*\:(aws|gcp|azure|alibaba).",
    "regex_string_division": ".*\ \/\ .*",
    "recommended_delay_for_cloud_metrics": 900,
    "recommented_delay_for_division": 60,
    "regex_url": ".*https?:.*",
    "regex_is_alert": ".*is_alert.*",
    "regex_notification": ".*@.*",
  }
  stats = {}
  for m in monitors:
    m["analysis"] = analyze_monitor(m, options)
    for key, value in m["analysis"].items():
      stats[key] = stats.get(key, 0) + (1 if value else 0)
  return {
    "monitors": monitors,
    "stats": stats,
  }