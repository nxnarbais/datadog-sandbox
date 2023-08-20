from datetime import datetime, timedelta
import pytz
import re

from libs.common.param_extractor import (
    get_state_last_modified,
    get_query,
    get_options,
    get_evaluation_delay,
    get_message,
    get_overall_state,
    get_matching_downtimes,
    get_type,
)
from libs.common.stringHandler import isMatchingRegex

def analyze_monitor(monitor, options):
    return {
        "has_triggered_recently": has_triggered_recently(monitor, options),
        "is_using_cloud_metrics": is_using_cloud_metrics(monitor, options),
        "is_using_division": is_using_division(monitor, options),
        "is_using_recommended_evaluation_delay_for_cloud_metrics_monitors": is_using_recommended_evaluation_delay_for_cloud_metrics_monitors(monitor, options),
        "is_using_recommended_evaluation_delay_for_division_monitors": is_using_recommended_evaluation_delay_for_division_monitors(monitor, options),
        "has_an_url_in_message": has_an_url_in_message(monitor, options),
        "is_using_conditional_statement": is_using_conditional_statement(monitor, options),
        "is_using_notification": is_using_notification(monitor, options),
        "is_using_escalation_message": is_using_escalation_message(monitor, options),
        "is_in_no_data_for_past_days": is_in_no_data_for_past_days(monitor, options),
        "is_in_alert_for_past_days": is_in_alert_for_past_days(monitor, options),
        "is_in_warning_for_past_days": is_in_warning_for_past_days(monitor, options),
        "is_muted_for_past_days": is_muted_for_past_days(monitor, options),
    }


def has_triggered_recently(monitor, options):
    """
    Whether or not the monitor has triggered in the `pastDays`

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    stateLastModified = get_state_last_modified("monitor", monitor)

    if stateLastModified is not None:
        stateLastModifiedDate = datetime.strptime(stateLastModified, "%Y-%m-%dT%H:%M:%S%z")
        pastDate = datetime.now() - timedelta(days=options["past_days"])
        pastDate = pytz.utc.localize(pastDate)
        if stateLastModifiedDate < pastDate:
            return False
        else:
            return True
    else:
        return False


def is_using_cloud_metrics(monitor, options):
    """
    Whether or not the monitor is using a cloud metric

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    query = get_query("monitor", monitor)
    regex_string_cloud_metrics = re.compile(options["regex_string_cloud_metrics"])

    return isMatchingRegex(query, regex_string_cloud_metrics)


def is_using_division(monitor, options):
    """
    Whether or not the monitor is using a divsion in its query

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    query = get_query("monitor", monitor)
    regex_string_division = re.compile(options["regex_string_division"])
    return isMatchingRegex(query, regex_string_division)


def is_using_recommended_evaluation_delay_for_cloud_metrics_monitors(monitor, options):
    """
    Whether or not the monitor is using the recommended evaluation delay for cloud metrics

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    if is_using_cloud_metrics(monitor, options):
        evaluationDelay = get_evaluation_delay("monitor", monitor)
        if (
            evaluationDelay is None
            or evaluationDelay < options["recommended_delay_for_cloud_metrics"]
        ):
            return False
        return True
    return True


def is_using_recommended_evaluation_delay_for_division_monitors(monitor, options):
    """
    Whether or not the monitor is using the recommended delay when using a divsion in its query

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    if is_using_division(monitor, options):
        evaluationDelay = get_evaluation_delay("monitor", monitor)
        if evaluationDelay is None or evaluationDelay < options["recommented_delay_for_division"]:
            return False
        return True
    return True


def has_an_url_in_message(monitor, options):
    """
    Whether or not the monitor is a URL in its message

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    return isMatchingRegex(get_message("monitor", monitor), re.compile(options["regex_url"]))


def is_using_conditional_statement(monitor, options):
    """
    Whether or not the monitor is using a conditional statement

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    return isMatchingRegex(get_message("monitor", monitor), re.compile(options["regex_is_alert"]))


def is_using_notification(monitor, options):
    """
    Whether or not the monitor is using a notification

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    return isMatchingRegex(get_message("monitor", monitor), re.compile(options["regex_notification"]))


def is_alerting_on_no_data(monitor, options):
    """
    Whether or not the monitor is using a message for no Data notification

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    if get_options("monitor", monitor).get("notify_no_data"):
        return True
    else:
        return False


def is_using_escalation_message(monitor, options):
    """
    Whether or not the monitor is using an escalation message

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    renotify_interval = get_options("monitor", monitor).get("renotify_interval")
    if renotify_interval is not None and renotify_interval != 0:
        return True
    else:
        return False


def is_in_no_data_for_past_days(monitor, options):
    """
    Whether or not the monitor is in no Data for the last past_days

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    if get_overall_state("monitor", monitor) == "No Data":
        return not has_triggered_recently(monitor, options)
    return False


def is_in_alert_for_past_days(monitor, options):
    """
    Whether or not the monitor is in no Alert for the last past_days

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    if get_overall_state("monitor", monitor) == "Alert":
        return not has_triggered_recently(monitor, options)
    return False


def is_in_warning_for_past_days(monitor, options):
    """
    Whether or not the monitor is in no Warning for the last past_days

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    if get_overall_state("monitor", monitor) == "Warning":
        return not has_triggered_recently(monitor, options)
    return False

def is_muted_for_past_days(monitor, options):
    """
    Wheter or not the monitor is muted since past day

    :param monitor: the monitor to evaluate the rule against
    :param options: the options of the rule

    :return: true or false depending of if the rule matched the monitor
    """
    downtimes = get_matching_downtimes("monitor", monitor)
    oldestStartDate = None
    for d in downtimes:
        startDate = d.get("start")
        if oldestStartDate is not None:
            if oldestStartDate > startDate:
                oldestStartDate = startDate
        else:
            oldestStartDate = startDate

    if oldestStartDate is None:
        return False

    oldestStartDate = datetime.fromtimestamp(oldestStartDate)
    thresholdDate = datetime.now() - timedelta(days=options["muted_past_days"])
    if oldestStartDate < thresholdDate:
        return True
    else:
        return False
