terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}

######################

resource "datadog_monitor" "usage_hosts_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][Hosts] Increase >${var.threshold_pct_change.infra_hosts}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.hosts{*} > ${var.threshold_pct_change.infra_hosts}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "Infra Host"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.infra_hosts
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:infra_host", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_custom_metric_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][CustomMetrics] Volume increase >${var.threshold_pct_change.infra_metrics}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.metrics.custom{*} > ${var.threshold_pct_change.infra_metrics}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "Infra Custom Metric"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.infra_metrics
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:infra_metric", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_apm_hosts_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][APM Hosts] Increase >${var.threshold_pct_change.apm_hosts}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.apm_hosts{*} > ${var.threshold_pct_change.apm_hosts}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "APM Host"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.apm_hosts
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:apm_hosts", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_apm_ingested_spans_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][APM Ingested Bytes] Increase >${var.threshold_pct_change.apm_ingested_bytes}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.apm.ingested_bytes{*}.as_count() > ${var.threshold_pct_change.apm_ingested_bytes}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "APM Ingested Byte"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.apm_ingested_bytes
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:apm_ingested_bytes", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_apm_indexed_spans_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][APM Indexed Spans] Increase >${var.threshold_pct_change.apm_indexed_spans}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.apm.indexed_spans{*}.as_count() > ${var.threshold_pct_change.apm_indexed_spans}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "APM Indexed Spans"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.apm_indexed_spans
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:apm_indexed_spans", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_logs_ingested_bytes_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][Logs Ingested Bytes] Increase >${var.threshold_pct_change.logs_ingested_bytes}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.logs.ingested_bytes{*}.as_count() > ${var.threshold_pct_change.logs_ingested_bytes}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "Logs Ingested Byte"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.logs_ingested_bytes
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:logs_ingested_bytes", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_logs_indexed_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][Logs Indexed] Increase >${var.threshold_pct_change.logs_indexed}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.logs.ingested_events{datadog_is_excluded:false}.as_count() > ${var.threshold_pct_change.logs_indexed}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "Logs Indexed"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.logs_indexed
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:logs_indexed", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_synthetics_api_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][Synthetics API] Increase >${var.threshold_pct_change.synthetics_api}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.synthetics.api_test_runs{*}.as_count() > ${var.threshold_pct_change.synthetics_api}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "Synthetics API"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.synthetics_api
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:synthetics_api", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_synthetics_browser_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][Synthetics Browser] Increase >${var.threshold_pct_change.synthetics_browser}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.synthetics.browser_test_runs{*}.as_count() > ${var.threshold_pct_change.synthetics_browser}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "Synthetics Browser"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.synthetics_browser
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:synthetics_browser", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_rum_session_mobile_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][RUM Session Mobile] Increase >${var.threshold_pct_change.rum_session_mobile}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.rum.sessions{sku:mobile}.as_count() > ${var.threshold_pct_change.rum_session_mobile}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "RUM Session Mobile"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.rum_session_mobile
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:rum_session_mobile", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_rum_session_replay_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][RUM Session Mobile] Increase >${var.threshold_pct_change.rum_session_replay}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.rum.sessions{sku:mobile}.as_count() > ${var.threshold_pct_change.rum_session_replay}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "RUM Session Replay"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.rum_session_replay
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:rum_session_replay", "owner:${var.owner}"], var.tags)
}

######################

resource "datadog_monitor" "usage_npm_host_pct_increase" {
  type                = "metric alert"
  name                = "[Usage][Global][NPM Host] Increase >${var.threshold_pct_change.npm_host}%"
  query               = <<EOF
pct_change(avg(last_1w),last_1mo):sum:datadog.estimated_usage.network.hosts{*} > ${var.threshold_pct_change.npm_host}
EOF
  message = templatefile(
    "${path.module}/message_usage_pct_increase.tpl",
    {
      sku = "NPM Host"
      notifications_alert = var.notifications.alert
    }
  )
  monitor_thresholds {
    critical          = var.threshold_pct_change.npm_host
  }
  include_tags        = true
  priority            = 3
  tags                = concat(["standard:true", "terraform:true", "type:usage_monitor", "sku:npm_host", "owner:${var.owner}"], var.tags)
}