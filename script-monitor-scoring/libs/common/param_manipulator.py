import re

import logging

from src.utils.param_extractor import get_queries

logger = logging.getLogger("mastermind_logger")


def split_query(asset_type: str, asset):

    if asset_type == "dashboard":
        query = get_queries(asset_type, asset)
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

    else:
        logger.warning("Asset type {} is not recognised for split_query".format(asset_type))
        return 0


def split_event_query(asset_type: str, asset):

    if asset_type == "dashboard":
        query = get_queries(asset_type, asset)

        if query is None or query == "":
            return {"query": query, "facets": []}

        # Number query parts in query
        # TODO: Improve regex not to edit the actual query
        # queryWithNoSpaceBetweenParenthesis = re.sub(r'[ ](?=[^\(]*?(?:\)|$))', '', query)
        queryWithNoSpaceBetweenParenthesis = re.sub(r"[ ](?=[^\(]*?(?:\)))", "", query)
        queryPartPattern = "([^ ]+)"
        queryPartPatternRegex = re.compile(queryPartPattern)
        queryParts = re.findall(queryPartPatternRegex, queryWithNoSpaceBetweenParenthesis)

        # Identify facets
        facets = []
        for qp in queryParts:
            facets.append(qp.split(":")[0])

        return {"query": query, "facets": facets}

    else:
        logger.warning("Asset type {} is not recognised for get_requests".format(asset_type))
        return 0
