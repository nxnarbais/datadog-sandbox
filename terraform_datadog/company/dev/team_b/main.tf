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
