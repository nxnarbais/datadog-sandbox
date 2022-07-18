terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}

###################### QUOTAS 

data "template_file" "message_quota_by_cluster" {
  template = file(
    "${path.module}/message_quota_by_cluster.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_indexed_span_index_quota" {
  type                = "metric alert"
  name                = "[Usage][IndexedSpans] Soft limit reached on {{kube_cluster_name.name}}"
  query               = <<EOF
sum(last_1h):datadog.estimated_usage.apm.indexed_spans_by_host{!kube_cluster_name:some_cluster_name} by {kube_cluster_name}.as_count() > ${var.threshold_per_cluster}
EOF
  message = data.template_file.message_quota_by_cluster.rendered
  monitor_thresholds {
    critical          = var.threshold_per_cluster
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:indexed_spans", "owner:${var.owner}"], var.tags)
}

data "template_file" "message_quota_by_service" {
  template = file(
    "${path.module}/message_quota_by_service.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_index_span_service_quota" {
  type                = "metric alert"
  name                = "[Usage][IndexedSpans] Soft limit reached on {{service.name}}"
  query               = <<EOF
sum(last_1h):datadog.estimated_usage.apm.indexed_spans{!service:some_service} by {service}.as_count() > ${var.threshold_per_service}
EOF
  message = data.template_file.message_quota_by_service.rendered
  monitor_thresholds {
    critical          = var.threshold_per_service
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:indexed_spans", "owner:${var.owner}"], var.tags)
}

###################### Anomalies per service

data "template_file" "message_anomaly_per_service" {
  template = file(
    "${path.module}/message_anomaly_per_service.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_indexed_spans_anomalies" {
  type                = "metric alert"
  name                = "[Usage][IndexedSpans][ForComposite] Anomaly on {{service.name}}"
  query               = <<EOF
avg(last_1d):anomalies(sum:datadog.estimated_usage.apm.indexed_spans{!service:some_service} by {service}.as_count(), 'agile', 5, direction='above', interval=300, alert_window='last_1h', count_default_zero='true', seasonality='weekly') >= 1
EOF
  message = "N/A - Used with composite monitor to reduce alert fatigue"
  monitor_thresholds {
    critical          = 1
  }
  include_tags        = true
  priority            = 5
  tags                = concat(["composite:true", "standard:true", "terraform:true", "type:usage_monitor", "sku:indexed_spans", "owner:${var.owner}"], var.tags)
}

resource "datadog_monitor" "usage_indexed_spans_minimum_volume" {
  type                = "metric alert"
  name                = "[Usage][IndexedSpans][ForComposite] Minimum indexed span volume"
  query               = <<EOF
sum(last_1h):sum:datadog.estimated_usage.apm.indexed_spans{!service:some_service} by {service}.as_count() < ${var.minimum_service_volume}
EOF
  message = "N/A - Used with composite monitor to reduce alert fatigue"
  monitor_thresholds {
    critical          = var.minimum_service_volume
  }
  include_tags        = true
  priority            = 5
  tags                = concat(["composite:true", "standard:true", "terraform:true", "type:usage_monitor", "sku:indexed_spans", "owner:${var.owner}"], var.tags)
}

resource "datadog_monitor" "usage_indexed_spans_anomalies_with_minimum_threshold" {
  name    = "[Usage][IndexedSpans] Anomaly on {{service.name}} (with minimum threshold)"
  type    = "composite"
  query   = "${datadog_monitor.usage_indexed_spans_anomalies.id} && !${datadog_monitor.usage_indexed_spans_minimum_volume.id}"
  message = data.template_file.message_anomaly_per_service.rendered

  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:indexed_spans", "owner:${var.owner}"], var.tags)
}

###################### Anomalies per business context

data "template_file" "message_anomaly_per_context" {
  template = file(
    "${path.module}/message_anomaly_per_context.tpl",
  )

  vars = {
    notifications_alert = var.notifications.alert
  }
}

resource "datadog_monitor" "usage_indexed_spans_anomalies_by_context" {
  type                = "metric alert"
  name                = "[Usage][IndexedSpans] Anomaly on specific context"
  query               = <<EOF
avg(last_1d):anomalies(sum:datadog.estimated_usage.apm.indexed_spans.by_tag{!team:abc,${var.context_filter}} by {${var.by_tag_keys}}.as_count(), 'agile', 5, direction='above', interval=300, alert_window='last_1h', count_default_zero='true', seasonality='weekly') >= 1
EOF
  message = data.template_file.message_anomaly_per_context.rendered
  monitor_thresholds {
    critical          = 1
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:indexed_spans", "owner:${var.owner}"], var.tags)
}