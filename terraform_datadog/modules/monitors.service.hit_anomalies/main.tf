resource "datadog_monitor" "hit_anomalies" {
  type                = "metric alert"
  name                = "[Service] Abnormal hit rate on ${var.service.name}"
  query               = <<EOF
sum(last_12h):anomalies(sum:trace.${var.service.operation_name}.hits{env:${var.env},service:${var.service.name}}.as_count(), 'agile', 2, direction='both', alert_window='last_30m', interval=120, count_default_zero='true', seasonality='daily') >= 1
EOF
  message = templatefile(
    "${path.module}/message.tpl",
    {
      notifications_alert = var.notifications.alert
      notifications_warn = var.notifications.warn
      notifications_recovery = var.notifications.recovery
      notifications_default = var.notifications.default
      notifications_no_data = var.notifications.no_data
    }
  )
  monitor_thresholds {
    critical          = 1
    # critical_revovery = 0
  }

  notify_no_data      = true
  no_data_timeframe   = 30

  include_tags        = true
  tags                = concat(["standard:true", "terraform:true", "env:${var.env}", "service:${var.service.name}", "owner:${var.owner}"], var.tags)
}
