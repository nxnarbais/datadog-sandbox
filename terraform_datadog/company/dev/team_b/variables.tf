variable "datadog_api_url" {
  default = "https://api.datadoghq.com/"
}

variable "datadog_api_key" {
  default = ""
}

variable "datadog_app_key" {
  default = ""
}

variable "notify_list" {
  description = "List of handles of users to notify when changes are made to this dashboard."
  default = [""]
}

variable "owner" {
  description = "Owner of the monitor"
  default = "narbais"
}

variable "tags" {
  description = "Additional tags"
  default = ["team:tam"]
}

variable "env" {
  description = "Default environment value"
  default = "prod"
}

variable "notifications" {
  type = map
  default = {
    "email" = "@john@doe.com"
    "slack" = "@slack-tam-not_setup"
  } 
}

