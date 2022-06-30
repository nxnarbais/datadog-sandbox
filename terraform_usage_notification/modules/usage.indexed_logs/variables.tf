
variable "threshold_per_index" {
  description = "Maximum cardinality for a metric"
  default = 10000000
}

variable "threshold_per_service" {
  description = "Maximum cardinality for a metric"
  default = 1000000
}

variable "minimum_service_volume" {
  description = "Minimum cardinality to trigger an alert"
  default = 300000
}

variable "by_tag_keys" {
  description = "Tag keys available in by_tag metrics"
  default = "cost_center,department,team"
}

variable "notifications" {
  type = map
  default = {
    alert = ""
    # warn = ""
    # recovery = ""
    # default = ""
    # no_data = ""
  }
}

variable "owner" {
  description = "Owner of the monitor."
  default = "nxnarbais"
}

variable "tags" {
  description = "List of custom tags to add to the monitor. It does not influence its behavior but help for the search." 
  type = list
  default = []
}

variable "context_filter" {
  description = "Context filter"
  default = "team:*"
  # default = "team:abc"
}
