import json
import requests
import time
import os
import math
from dotenv import load_dotenv

DD_SITE = 'https://api.datadoghq.com/'
NOW = math.floor(time.time())

load_dotenv()

try:
    DD_API_KEY = os.environ["DD_API_KEY"]
except KeyError:
    DD_API_KEY = "DD_API_KEY not available!"
    print("DD_API_KEY not available!")

try:
    DD_APP_KEY = os.environ["DD_APP_KEY"]
except KeyError:
    DD_APP_KEY = "DD_APP_KEY not available!"
    print("DD_APP_KEY not available!")

#################################
# DASHBOARDS
#################################
def getAllDashboards():
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY,
        'DD-APPLICATION-KEY': DD_APP_KEY
    }
    url = '{}api/v1/dashboard'.format(DD_SITE)
    r = requests.get(url, data=json.dumps(payload), headers=headers)
    jsonResponse = r.json()
    return jsonResponse

def getDashboardDetails(ID):
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY,
        'DD-APPLICATION-KEY': DD_APP_KEY
    }
    url = '{}api/v1/dashboard/{}'.format(DD_SITE, ID)
    r = requests.get(url, data=json.dumps(payload), headers=headers)
    jsonResponse = r.json()
    return jsonResponse

def getAllDashboardsWithDetails():
    dashboards = getAllDashboards().get('dashboards')
    dashboardsWithDetails = []
    dashboardCount = len(dashboards)
    i = 0
    for dashboard in dashboards:
        i = i + 1
        print('Get dashboard details - progress {}/{}'.format(i, dashboardCount))
        dashboardsWithDetails.append(getDashboardDetails(dashboard.get("id")))
    return dashboardsWithDetails

#################################
# MONITORS
#################################
def getAllMonitors():
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY,
        'DD-APPLICATION-KEY': DD_APP_KEY
    }
    url = '{}api/v1/monitor'.format(DD_SITE)
    r = requests.get(url, data=json.dumps(payload), headers=headers)
    jsonResponse = r.json()
    return jsonResponse

#################################
# TIMESERIES
#################################
def postTimeserieToDatadogV1(metricname, hostname, value, tags, type = "gauge"):
    timestamp = time.time()
    payload = { "series": [{
        "metric": metricname,
        "points": [[timestamp, value]],
        "type": type,
        "host": hostname,
        "tags": tags
    }]}
    headers = {'content-type': 'application/json'}
    # print({ 'headers': headers })
    url = '{}api/v1/series?api_key={}'.format(DD_SITE, DD_API_KEY)
    # print(timestamp)
    # print(payload)
    # print(headers)
    # print(url)
    r = requests.post(url, data=json.dumps(payload), headers=headers)
    jsonResponse = r.json()
    return jsonResponse

def buildTimeseries(metricName, metricType, value, tags):
    return {
        'metric': metricName,
        'type': metricType, # The available types are 0 (unspecified), 1 (count), 2 (rate), and 3 (gauge).
        'points': [{
            'timestamp': NOW,
            'value': value
        }],
        'tags': tags
    }

def postTimeserieToDatadogV2(series):
    payload = { 'series': series }
    headers = {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY
    }
    url = 'https://api.datadoghq.com/api/v2/series?api_key={}'.format(DD_API_KEY)
    r = requests.post(url, data=json.dumps(payload), headers=headers)
    jsonResponse = r.json()
    return jsonResponse

def postTimeseriesToDatadog(metricName, metricType, value, tags):
    payload = {
        'series': [{
            'metric': metricName,
            'type': metricType,
            'points': [{
                'timestamp': NOW,
                'value': value
            }],
            'tags': tags
        }]
    }
    # print({ 'payload': payload })
    headers = {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY
    }
    # print({ 'headers': headers })
    url = 'https://api.datadoghq.com/api/v2/series?api_key={}'.format(DD_API_KEY)
    r = requests.post(url, data=json.dumps(payload), headers=headers)
    jsonResponse = r.json()
    return jsonResponse
  