# Providers

terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}

# Datadog
provider "datadog" {
  api_url = var.datadog_api_url
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
}

# SERVICE A

module "monitor_service_error_rate_service_a" {
  source = "../../../modules/monitors.service.error_rate"
  env = var.env
  tags = var.tags
  service = {
    "name" = "service-a"
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

module "monitor_service_p90_service_a" {
  source = "../../../modules/monitors.service.latency"
  env = var.env
  latency_percentile = "p90"
  tags = var.tags
  service = {
    "name" = "service-a"
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

module "monitor_service_hit_anomalies_service_a" {
  source = "../../../modules/monitors.service.hit_anomalies"
  env = var.env
  tags = var.tags
  service = {
    "name" = "service-a"
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

resource "datadog_service_level_objective" "slo_service_service_a" {
  name        = "[Service] SLO on service-a"
  type        = "monitor"
  description = "some SLO description"
  monitor_ids = [
    module.monitor_service_error_rate_service_a.monitors_service_error_rate_id,
    module.monitor_service_p90_service_a.monitors_service_latency_id,
    module.monitor_service_hit_anomalies_service_a.monitors_hit_anomalies_id
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

  tags                = concat(["standard:true", "terraform:true", "env:${var.env}", "service:service-a", "owner:narbais"], var.tags)
}

# SERVICE B

module "monitor_service_error_rate_service_b" {
  source = "../../../modules/monitors.service.error_rate"
  env = var.env
  tags = var.tags
  service = {
    "name" = "service-b"
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

module "monitor_service_p90_service_b" {
  source = "../../../modules/monitors.service.latency"
  env = var.env
  latency_percentile = "p90"
  tags = var.tags
  service = {
    "name" = "service-b"
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

module "monitor_service_p95_service_b" {
  source = "../../../modules/monitors.service.latency"
  env = var.env
  latency_percentile = "p95"
  tags = var.tags
  service = {
    "name" = "service-b"
    "operation_name" = "aspnet_core.request"
  }
  thresholds = {
    "alert"  = 4 #seconds
    "warn"   = 3 #seconds
  }
  notifications = {
    alert = ""
    warn = ""
    recovery = ""
    default = ""
    no_data = ""
  }
  owner = var.owner
}

# SERVICE C

module "monitor_service_error_rate_service_c" {
  source = "../../../modules/monitors.service.error_rate_with_min_hits"
  env = var.env
  tags = var.tags
  minimum_hit_rate = 50
  service = {
    "name" = "service-c"
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