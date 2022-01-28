variable "system_mem_pct_usable_enabled" {
  description = "Enable monitor on system.mem.pct_usable"
  default = "true"
}

variable "selected_tags" {
  description = "Selected tags"
  default = ""
}

variable "thresholds" {
  type = map
  default = {
    "alert"  = 0.1
    "warn"   = 0.2
  }
}

variable "locked" {
  description = "A boolean indicating whether changes to to this monitor should be restricted to the creator or admins."
  default = true
}

variable "notifications" {
  type = map
  description = "Space seperated string of receivers for this monitor notification in the different situations."
  default = {
    alert = ""
    warn = ""
    recovery = ""
    default = ""
  }
}
