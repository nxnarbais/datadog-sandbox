terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}

######################

data "template_file" "message_quota" {
  template = file(
    "${path.module}/message_quota.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_custom_metric_quota" {
  type                = "metric alert"
  name                = "[Usage][CustomMetrics] Soft limit reached on {{metric_name.value}}"
  query               = <<EOF
avg(last_15m):sum:datadog.estimated_usage.metrics.custom.by_metric{metric_name:${var.metric_namespace}} by {metric_name} > ${var.threshold_per_metric_name}
EOF
  message = data.template_file.message_quota.rendered
  monitor_thresholds {
    critical          = var.threshold_per_metric_name
  }
  include_tags        = true
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:metric", "owner:${var.owner}"], var.tags)
}

######################

data "template_file" "message_global_anomaly" {
  template = file(
    "${path.module}/message_global_anomaly.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_custom_metric_global_anomalies" {
  type                = "metric alert"
  name                = "[Usage][CustomMetrics] Anomaly on overall custom metric volume"
  query               = <<EOF
avg(last_1d):anomalies(sum:datadog.estimated_usage.metrics.custom{*}, 'agile', 3, direction='above', interval=300, alert_window='last_1h', count_default_zero='true', seasonality='weekly') >= 1
EOF
  message = data.template_file.message_global_anomaly.rendered
  monitor_thresholds {
    critical          = 1
  }
  include_tags        = true
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:metric", "owner:${var.owner}"], var.tags)
}

######################

data "template_file" "message_anomaly" {
  template = file(
    "${path.module}/message_anomaly.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_custom_metric_anomalies" {
  type                = "metric alert"
  name                = "[Usage][CustomMetrics][ForComposite] Anomaly on {{metric_name.value}}"
  query               = <<EOF
avg(last_1d):anomalies(sum:datadog.estimated_usage.metrics.custom.by_metric{metric_name:${var.metric_namespace},!metric_name:metric_to_exclude} by {metric_name}, 'agile', 3, direction='above', interval=300, alert_window='last_1h', count_default_zero='true', seasonality='weekly') >= 1
EOF
  message = "N/A - Used with composite monitor to reduce alert fatigue"
  monitor_thresholds {
    critical          = 1
  }
  include_tags        = true
  tags                = concat(["composite:true", "standard:true", "terraform:true", "type:usage_monitor", "sku:metric", "owner:${var.owner}"], var.tags)
}

resource "datadog_monitor" "usage_custom_metric_minimum_cardinality" {
  type                = "metric alert"
  name                = "[Usage][CustomMetrics][ForComposite] Minimum Cardinality"
  query               = <<EOF
avg(last_15m):sum:datadog.estimated_usage.metrics.custom.by_metric{metric_name:${var.metric_namespace},!metric_name:metric_to_exclude} by {metric_name} < ${var.minimum_cardinality}
EOF
  message = "N/A - Used with composite monitor to reduce alert fatigue"
  monitor_thresholds {
    critical          = var.minimum_cardinality
  }
  include_tags        = true
  tags                = concat(["composite:true", "standard:true", "terraform:true", "type:usage_monitor", "sku:metric", "owner:${var.owner}"], var.tags)
}

resource "datadog_monitor" "usage_custom_metric_anomalies_with_minimum_threshold" {
  name    = "[Usage][CustomMetrics] Anomaly on {{metric_name.value}} (with minimum threshold)"
  type    = "composite"
  query   = "${datadog_monitor.usage_custom_metric_anomalies.id} && !${datadog_monitor.usage_custom_metric_minimum_cardinality.id}"
  message = data.template_file.message_anomaly.rendered

  include_tags        = true
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:metric", "owner:${var.owner}"], var.tags)
}

######################

data "template_file" "message_anomaly_by_context" {
  template = file(
    "${path.module}/message_anomaly.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_custom_metric_anomalies_by_context" {
  type                = "metric alert"
  name                = "[Usage][CustomMetrics] Anomaly on specific context"
  query               = <<EOF
avg(last_1d):anomalies(sum:datadog.estimated_usage.metrics.custom.by_tag{${var.context_filter}} by {${var.by_tag_keys}}, 'agile', 3, direction='above', interval=300, alert_window='last_1h', count_default_zero='true', seasonality='weekly') >= 1
EOF
  message = data.template_file.message_anomaly_by_context.rendered
  monitor_thresholds {
    critical          = 1
  }
  include_tags        = true
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:metric", "owner:${var.owner}"], var.tags)
}