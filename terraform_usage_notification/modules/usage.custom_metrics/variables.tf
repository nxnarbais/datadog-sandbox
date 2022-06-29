
variable "threshold_per_metric_name" {
  description = "Maximum cardinality for a metric"
  default = 20000
}

variable "minimum_cardinality" {
  description = "Minimum cardinality to trigger an alert"
  default = 1000
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

variable "metric_namespace" {
  description = "Selection of a metric namespace e.g. `my_service.*`"
  default = "*"
}

variable "context_filter" {
  description = "Context filter"
  default = "*"
  # default = "team:abc"
}
