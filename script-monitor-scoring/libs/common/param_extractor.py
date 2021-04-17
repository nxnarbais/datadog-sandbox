import re

import logging

logger = logging.getLogger("mastermind_logger")


def get_tags(asset_type, asset):
    if asset_type == "dashboard":
        desc = asset.get("description")
        if desc is None:
            return []
        # TAG_REGEX_PATTERN = r"[\w-_:,\/]+" # doc: https://docs.datadoghq.com/getting_started/tagging/#defining-tags
        TAG_REGEX_PATTERN = r"[a-zA-Z][0-9a-zA-Z-_,\.\/]*:[0-9a-zA-Z-_,\.\/]+"  # more specific not to catch all words
        return re.findall(TAG_REGEX_PATTERN, desc)

    elif asset_type == "host":
        tag_by_source = asset.get("tags_by_source", [])
        tags = []
        for attr, value in tag_by_source.items():
            tags.extend(value)
        return tags

    elif asset_type == "monitor" or asset_type == "slo" or asset_type == "synthetic":
        return asset.get("tags", [])

    elif asset_type == "logPipelines" or asset_type == "logIndexes":
        # Log pipeline and indexes are not tagged
        return []
    else:
        logger.error("Asset type {} is not recognised for get_tags".format(asset_type))
        return 0


def get_type(asset_type: str, asset):
    """
    Get the type of a given asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the id from

    :return: The type of the asset
    """
    if asset_type == "synthetic" or asset_type == "monitor" or asset_type == "slo":
        return asset.get("type")
    elif asset_type == "dashboard":
        return asset.get("layout")
    else:
        logger.error("Asset type {} is not recognised for get_type".format(asset_type))
        return 0


def get_description(asset_type: str, asset):
    """
    Get a description of the asset for human identification (e.g. a title)

    asset_type: monitor|dashboard|slo|synthetic
    asset: the asset to get the description from

    Return: asset description
    """
    if asset_type == "dashboard":
        return asset.get("title")

    elif asset_type == "monitor":
        return "{} - type:{} query:{}".format(
            asset.get("name"),
            get_type(asset_type, asset),
            asset.get("query"),
        )
    elif asset_type == "slo":
        return asset.get("name")
    elif asset_type == "synthetic":
        return "{} - status:{} type:{}".format(
            asset.get("name"),
            asset.get("status"),
            get_type(asset_type, asset),
        )
    else:
        logger.error("Asset type {} is not recognised for get_description".format(asset_type))
        return 0


def get_key_params(asset_type: str, asset):
    if asset_type == "dashboard":
        return {
            "title": asset.get("title"),
        }
    elif asset_type == "monitor":
        return {
            "name": asset.get("name"),
            "type": get_type(asset_type, asset),
            "query": asset.get("query"),
        }
    elif asset_type == "slo":
        return {"name": asset.get("name")}
    elif asset_type == "synthetic":
        return {
            "name": asset.get("name"),
            "status": asset.get("status"),
            "type": get_type(asset_type, asset),
        }
    elif asset_type == "host":
        return {
            "host_name": asset.get("host_name"),
        }
    else:
        logger.error("Asset type {} is not recognised for get_key_params".format(asset_type))
        return 0


def get_options(asset_type: str, asset):
    """
    Get the options of a given asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the option from

    :return: The options associated with the asset
    """
    if asset_type == "monitor" or asset_type == "synthetic":
        return asset.get("options", {})
    else:
        logger.error("Asset type {} is not recognised for get_options".format(asset_type))
        return 0


def get_locations(asset_type: str, asset):
    """
    Get the location of a given asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the location from

    :return: The locations associated with the asset
    """
    if asset_type == "synthetic":
        return asset.get("locations", [])
    else:
        logger.error("Asset type {} is not recognised for get_locations".format(asset_type))
        return 0


def get_monthly_execution_count(asset_type: str, asset):
    """
    Get the amount of execution in the last month

    :param asset_type: The type of the asset

    :param asset: The asset to get the number of monthly execution from

    :return: The amount of execution in the last month
    """

    SECONDS_PER_MONTH = 720 * 60 * 60  # 720 hours, 60 min, 60 sec

    if asset_type == "synthetic":
        locationCount = len(get_locations(asset_type, asset))
        deviceCount = len(get_options(asset_type, asset).get("device_ids", []))
        monthlyExecutionCount = SECONDS_PER_MONTH / get_options(asset_type, asset).get(
            "tick_every", 0
        )
        return locationCount * deviceCount * monthlyExecutionCount
    else:
        logger.error(
            "Asset type {} is not recognised for get_monthly_execution_count".format(asset_type)
        )
        return 0


def get_id(asset_type: str, asset):
    """
    Get the amount of execution in the last month

    :param asset_type: The type of the asset

    :param asset: The asset to get the id from

    :return: The id of the asset
    """

    if (
        asset_type == "monitor"
        or asset_type == "host"
        or asset_type == "dashboard"
        or asset_type == "slo"
    ):
        return asset.get("id")
    elif asset_type == "synthetic":
        return asset.get("public_id")
    else:
        logger.error("Asset type {} is not recognised for get_id".format(asset_type))
        return 0


def get_state_last_modified(asset_type: str, asset):
    """
    Get the state of the last modification

    :param asset_type: The type of the asset

    :param asset: The asset to get the last modification date from

    :return: The date of last modification
    """

    if asset_type == "monitor":
        return asset.get("overall_state_modified")
    else:
        logger.error(
            "Asset type {} is not recognised for get_state_last_modified".format(asset_type)
        )
        return 0


def get_query(asset_type: str, asset):
    """
    Get the query of the asset.

    :param asset_type: The type of the asset

    :param asset: The asset to get the query from

    :return: The query of the asset
    """
    if asset_type == "monitor":
        return asset.get("query")
    else:
        logger.error("Asset type {} is not recognised for get_query".format(asset_type))
        return 0


def get_evaluation_delay(asset_type: str, asset):
    """
    Get the delay of evaluation.

    :param asset_type: The type of the asset

    :param asset: The asset to get the evaluation delay from

    :return: The delay of evaluation
    """
    if asset_type == "monitor":
        return get_options(asset_type, asset).get("evaluation_delay", 0)
    else:
        logger.error("Asset type {} is not recognised for get_evaluation_delay".format(asset_type))
        return 0


def get_message(asset_type: str, asset):
    """
    Get the message of the asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the message from

    :return: The message of the asset
    """
    if asset_type == "monitor":
        return asset.get("message", "")
    else:
        logger.error("Asset type {} is not recognised for get_message".format(asset_type))
        return 0


def get_overall_state(asset_type: str, asset):
    """
    Get the overall state of the asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the state from

    :return: The state of the asset
    """
    if asset_type == "monitor":
        return asset.get("overall_state")
    else:
        logger.error("Asset type {} is not recognised for get_overall_state".format(asset_type))
        return 0


def get_matching_downtimes(asset_type: str, asset):
    """
    Get the associated downtimes from the asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the downtime from

    :return: The downtime associated with the asset
    """
    if asset_type == "monitor":
        return asset.get("matching_downtimes")
    else:
        logger.error(
            "Asset type {} is not recognised for get_matching_downtimes".format(asset_type)
        )
        return 0


def get_agent_version(asset_type: str, asset):
    """
    Get the associated agent version from the asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the agent version from

    :return: The agent version associated with the asset
    """
    if asset_type == "host":
        return asset.get("meta", {}).get("agent_version", "No agent")
    else:
        logger.error("Asset type {} is not recognised for get_agent_version".format(asset_type))
        return 0


def get_last_modified(asset_type: str, asset):
    """
    Get the latest date of modification

    :param asset_type: The type of the asset

    :param asset: The asset to get the agent version from

    :return: The latest day the asset was modified
    """
    if asset_type == "dashboard":
        return asset.get("modified_at", "1990-01-01T00:00:01.000000+00:00")
    else:
        logger.error("Asset type {} is not recognised for get_last_modified".format(asset_type))
        return 0


def get_widgets(asset_type: str, asset):
    """
    Get all widgets

    :param asset_type: The type of the asset

    :param asset: The asset to get the agent version from

    :return: The all widgets associated with the asset
    """
    if asset_type == "dashboard":
        res = []
        widgets = asset.get("widgets", [])
        res = res + widgets
        for w in widgets:
            # section required to take into account groups which contains other widgets
            wWidgets = w.get("definition", {}).get("widgets")
            if wWidgets is not None:
                res = res + wWidgets
        return res

    else:
        logger.error("Asset type {} is not recognised for get_widgets".format(asset_type))
        return 0


def get_requests(asset_type: str, asset):
    """
    Get all requests from the asset

    :param asset_type: The type of the asset

    :param asset: The asset to get the agent version from

    :return: An array of all the widget requests
    """
    if asset_type == "dashboard":

        res = []
        widgets = get_widgets(asset_type, asset)
        for w in widgets:
            requests = w.get("definition", {}).get("requests")
            t = w.get("definition", {}).get("type")
            if requests is not None:
                # Special case for hostmap requests that are not a list but a dict
                if t == "hostmap":
                    requests = [requests]
                # TODO: Make it work for scatterplot as well
                # if t == "scatterplot":
                #   Do something
                #   Scatterplot requests: {'y': {'q': 'max:starbug.slow_response_seconds.quantile{$cluster,$service-ro,$host,quantile:0.99} by {host, is_big_request}', 'aggregator': 'max'}, 'x': {'q': 'max:starbug.slow_response_seconds.count{$service-ro,$cluster,$host} by {host, is_big_request}', 'aggregator': 'max'}}
                if t != "scatterplot":
                    res = res + requests
        return res

    else:
        logger.error("Asset type {} is not recognised for get_requests".format(asset_type))
        return 0


def get_queries(asset_type: str, asset):
    """
    Get all queries from the asset

    :param asset_type: The type of the asset

    :param asset: The asset to get all queries from

    :return: An array of all the widget queries as {
          "metric_query": [],
          "apm_query": [],
          "hostmap_query": [],
          "log_query": [],
          "rum_query": [],
          "network_query": [],
          "query": [],  # events
      }
    """
    if asset_type == "dashboard":
        res = {
            "metric_query": [],
            "apm_query": [],
            "hostmap_query": [],
            "log_query": [],
            "rum_query": [],
            "network_query": [],
            "query": [],  # events
        }
        requests = get_requests("dashboard", asset)

        for r in requests:
            query = r.get("q")
            if query is not None:
                res["metric_query"].append(query)
            query = r.get("apm_query")
            if query is not None:
                res["apm_query"].append(query)
            query = r.get("fill", {}).get("q")
            if query is not None:
                res["hostmap_query"].append(query)
            if query is not None:
                res["log_query"].append(query)
            if query is not None:
                res["rum_query"].append(query)
            if query is not None:
                res["network_query"].append(query)
            if query is not None:
                res["query"].append(query)
        return res

    else:
        logger.error("Asset type {} is not recognised for get_requests".format(asset_type))
        return 0


def get_and_format_asset_tags(asset_type: str, asset):
    """
    Take all tags from a given asset and return an array of JSON object with the format
    [{"key": "<TAG_KEY>","value": "<TAG_VALUE>"}]
    """
    ## Extract key and value from tag
    tags = get_tags(asset_type, asset)
    formated_tags = []

    for tag in tags:
        tSplit = tag.split(":", 1)
        tagKey = tSplit[0]
        try:
            tagValue = tSplit[1]
            formated_tags.append({"key": tagKey, "value": tagValue})
        except IndexError:
            # The tag string does not include a `:` e.g.: "teamabc"
            formated_tags.append({"key": "undefined", "value": tagKey})

    return formated_tags


def get_all_tag_values(asset_type: str, asset, tag_key: str):
    """
    Get various values for a specific tag key
    """
    tagValues = []
    asset_tags = get_and_format_asset_tags(asset_type, asset)

    for tag in asset_tags:
        if tag["key"] == tag_key:
            tagValues.append(tag["value"])
    if len(tagValues) > 0:
        return tagValues
    else:
        return 0


# TODO: Test and improve
def split_metric_query(query):
    if query is None:
        return None

    # Number of arithmetic function used +,-,/,*
    arithmeticPattern = r"( ?[+/\-*][^}])"
    arithmeticPatternRegex = re.compile(arithmeticPattern)
    arithmeticCount = len(re.findall(arithmeticPatternRegex, query))

    # Metrics
    metricPattern = r":([0-9a-zA-Z._]+){"
    metricPatternRegex = re.compile(metricPattern)
    metrics = re.findall(metricPatternRegex, query)

    # Tags for each metric
    tagsPattern = r"(?<!by ){([0-9a-zA-Z._:/,\-$]+)}"
    tagsPatternRegex = re.compile(tagsPattern)
    tags = re.findall(tagsPatternRegex, query)

    # By tags
    byTagsPattern = r" by {([0-9a-zA-Z._:,\-]+)}"
    byTagsPatternRegex = re.compile(byTagsPattern)
    byTags = re.findall(byTagsPatternRegex, query)

    # By functions
    fctPattern = r"([a-zA-Z0-9_]+)\("
    fctPatternRegex = re.compile(fctPattern)
    fcts = re.findall(fctPatternRegex, query)

    return {
        "query": query,
        "metrics": metrics,
        "arithmeticCount": arithmeticCount,
        "tags": tags,
        "byTags": byTags,
        "functions": fcts,
    }
