variable "datadog_api_url" {
  default = "https://api.datadoghq.com/"
}

variable "datadog_api_key" {
  default = ""
}

variable "datadog_app_key" {
  default = ""
}

variable "main_tags" {
  default = "owner:team_a,env:prod"
}

variable "main_tags_in_array" {
  default = ["owner:team_a", "env:prod"]
}

variable "notifications" {
  type = map
  default = {
    email = "@john@doe.com @john@smith.com"
    slack = "@slack-my_channel"
  }
}