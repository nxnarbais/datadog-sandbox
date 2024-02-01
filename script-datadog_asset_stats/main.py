import json
import re
from datadog import getAllDashboardsWithDetails, getAllMonitors, buildTimeseries, postTimeserieToDatadogV2

def getDependencyTreeFromDashboards(dependency, dashboards):
    for dashboard in dashboards:
        dashboardTxt = json.dumps(dashboard)
        dashLinks = re.findall("/dashboard/[\w]{3}-[\w]{3}-[\w]{3}", dashboardTxt)
        # print(dashboard.get("id"), dashLinks)
        for dashLink in dashLinks:
            if dashLink != "/dashboard/{}".format(dashboard.get("id")):
                if dashLink not in dependency:
                    dependency[dashLink] = {
                        "dashboards": []
                    }
                if dashboard.get("id") not in dependency[dashLink]["dashboards"]:
                    dependency[dashLink]["dashboards"].append(dashboard.get("id"))

def getDependencyTreeFromMonitors(dependency, monitors):
    for monitor in monitors:
        message = monitor.get("message")
        dashLinks = re.findall("/dashboard/[\w]{3}-[\w]{3}-[\w]{3}", message)
        # print(monitor.get("id"), dashLinks)
        for dashLink in dashLinks:
            if dashLink not in dependency:
                dependency[dashLink] = {
                    "monitors": []
                }
            if monitor.get("id") not in dependency[dashLink]["monitors"]:
                dependency[dashLink]["monitors"].append(monitor.get("id"))

def publishDashboardRankingToDD(dependency):
    # INIT
    dashboardCount = len(dependency.keys())
    dashboardKeys = dependency.keys()
    i = 0

    for dashboardKey in dashboardKeys:
        print('Datadog publish metric - progress {}/{}'.format(i, dashboardCount))
        i = i + 1
        dashboardID = dashboardKey.split("/dashboard/")[1]

        tags = ["dashboard:{}".format(dashboardID), "owner:narbais"]
        dashboardLinkCount = len(dependency.get(dashboardKey).get("dashboards", []))
        monitorLinkCount = len(dependency.get(dashboardKey).get("monitors", []))

        timeseries = [
            buildTimeseries("datadog.dashboards.links", 3, dashboardLinkCount, ["origin:dashboards"] + tags),
            buildTimeseries("datadog.dashboards.links", 3, monitorLinkCount, ["origin:monitors"] + tags)
        ]
        # print(timeseries)
        postTimeserieToDatadogV2(timeseries)

print("START: Datadog Asset Stats script")

dashboards = getAllDashboardsWithDetails()
# print(json.dumps(dashboards, indent=2))

monitors = getAllMonitors()
# print(json.dumps(monitors, indent=2))

dependency = {}
getDependencyTreeFromDashboards(dependency, dashboards)
getDependencyTreeFromMonitors(dependency, monitors)
print(json.dumps(dependency, indent=2))

publishDashboardRankingToDD(dependency)
