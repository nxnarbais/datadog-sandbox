variable "service_list" {
  description = "List of services"
  type        = list(string)
  default     = ["generic_service_1", "generic_service_2"]
}

module "monitor_service_error_rate_generic" {
  source = "../../../modules/monitors.service.error_rate"
  count = length(var.service_list)

  env = var.env
  tags = var.tags
  service = {
    "name" = var.service_list[count.index]
    "operation_name" = "aspnet_core.request"
  }
  thresholds = {
    "alert"  = 3
    "warn"   = 2
  }
  notifications = {
    alert = "${var.notifications.email} ${var.notifications.slack}"
    warn = ""
    recovery = ""
    default = ""
    no_data = ""
  }
  owner = var.owner
}

module "monitor_service_p90_generic" {
  source = "../../../modules/monitors.service.latency"
  count = length(var.service_list)

  env = var.env
  latency_percentile = "p90"
  tags = var.tags
  service = {
    "name" = var.service_list[count.index]
    "operation_name" = "aspnet_core.request"
  }
  thresholds = {
    "alert"  = 3 #seconds
    "warn"   = 2.5 #seconds
  }
  notifications = {
    alert = "${var.notifications.email} ${var.notifications.slack}"
    warn = ""
    recovery = ""
    default = ""
    no_data = ""
  }
  owner = var.owner
}

module "monitor_service_hit_anomalies_generic" {
  source = "../../../modules/monitors.service.hit_anomalies"
  count = length(var.service_list)

  env = var.env
  tags = var.tags
  service = {
    "name" = var.service_list[count.index]
    "operation_name" = "aspnet_core.request"
  }
  notifications = {
    alert = "${var.notifications.email} ${var.notifications.slack}"
    warn = ""
    recovery = ""
    default = ""
    no_data = ""
  }
  owner = var.owner
}

resource "datadog_service_level_objective" "slo_service_generic" {
  count = length(var.service_list)

  name        = "[Service] SLO on ${var.service_list[count.index]}"
  type        = "monitor"
  description = "some SLO description"
  monitor_ids = [
    module.monitor_service_error_rate_generic[count.index].monitors_service_error_rate_id,
    module.monitor_service_p90_generic[count.index].monitors_service_latency_id,
    module.monitor_service_hit_anomalies_generic[count.index].monitors_hit_anomalies_id
  ]

  thresholds {
    timeframe = "7d"
    target    = 99.9
    warning   = 99.99
  }

  thresholds {
    timeframe = "30d"
    target    = 99.9
    warning   = 99.99
  }

  timeframe         = "30d"
  target_threshold  = 99.9
  warning_threshold = 99.99

  tags                = concat(["standard:true", "terraform:true", "env:${var.env}", "service:${var.service_list[count.index]}", "owner:narbais"], var.tags)
}