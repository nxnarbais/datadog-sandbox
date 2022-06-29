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


module "main_usage_custom_metric_quota" {
  source = "./modules/usage.custom_metrics"
  threshold_per_metric_name = 100000
  # metric_namespace = "my_team.*"
  notifications = {
    alert = "${var.notifications.email}"
  }
  owner = var.owner
}






