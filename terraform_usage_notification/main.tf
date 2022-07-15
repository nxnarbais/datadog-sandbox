# Providers

# Datadog

terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}

variable "datadog_api_url" {
  type = string
}
variable "datadog_api_key" {
  type = string
}
variable "datadog_app_key" {
  type = string
}

provider "datadog" {
  api_url = var.datadog_api_url
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
}


module "main_usage_custom_metric" {
  source = "./modules/usage.custom_metrics"
  threshold_per_metric_name = 100000
  # metric_namespace = "my_team.*"
  metric_name_filter_for_soft_quota = "!metric_name:app1.count,!metric_name:app2.middleware.rev"
  by_tag_keys = "cost_center,department,team"
  notifications = {
    alert = "${var.notifications.email}"
  }
  owner = var.owner
}

module "main_usage_indexed_logs" {
  source = "./modules/usage.indexed_logs"
  threshold_per_index     = 10000000
  threshold_per_service   = 1000000
  minimum_service_volume  = 50000
  by_tag_keys = "cost_center,department,team"
  context_filter = "service:*"
  notifications = {
    alert = "${var.notifications.email}"
  }
  owner = var.owner
}

module "main_usage_ingested_logs" {
  source = "./modules/usage.ingested_logs"
  threshold_per_index     = 10000000
  threshold_per_service   = 1000000
  minimum_service_volume  = 50000
  by_tag_keys = "cost_center,department,team"
  context_filter = "service:*"
  notifications = {
    alert = "${var.notifications.email}"
  }
  owner = var.owner
}

module "main_usage_indexed_spans" {
  source = "./modules/usage.indexed_spans"
  threshold_per_cluster     = 10000000
  threshold_per_service   = 1000000
  minimum_service_volume  = 50000
  by_tag_keys = "cost_center,department,team"
  context_filter = "service:*"
  notifications = {
    alert = "${var.notifications.email}"
  }
  owner = var.owner
}
