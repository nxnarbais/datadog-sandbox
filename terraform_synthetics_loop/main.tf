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

resource "datadog_synthetics_test" "loop_test_api" {
  type    = "api"
  subtype = "http"

  count = length(var.url_list)

  request_definition {
    method = "GET"
    # url    = "https://www.example.org"
    url = var.url_list[count.index]
  }

  assertion {
    type     = "statusCode"
    operator = "is"
    target   = "200"
  }

  locations = ["aws:eu-central-1"]

  options_list {
    tick_every = 900

    retry {
      count    = 2
      interval = 300
    }

    monitor_options {
      renotify_interval = 120
    }
  }

  name    = "[MyUseCase] ${var.url_list[count.index]} index:${count.index}"
  message = "Something is broken on ${var.url_list[count.index]} please follow [instructions](https://link_to_instructions). ${var.notifications.email}"

  tags    = concat(["standard:true", "terraform:true", "type:synthetic_loop", "owner:${var.owner}"], var.tags)

  status = "live"
}
