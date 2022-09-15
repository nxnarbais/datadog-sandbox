
variable "threshold_pct_change" {
  description = "Various thresholds for alert"
  type = map
  default = {
    infra_hosts = 5
    infra_metrics = 5
    apm_hosts = 5
    apm_ingested_bytes = 5
    apm_indexed_spans = 5
    logs_ingested_bytes = 5
    logs_indexed = 5
    synthetics_api = 5
    synthetics_browser = 5
    rum_session_mobile = 5
    rum_session_replay = 5
    npm_host = 5
  }
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
