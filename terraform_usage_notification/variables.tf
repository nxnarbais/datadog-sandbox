variable "notifications" {
  type = map
  default = {
    email = "my_email@ddog.com"
  }
}

variable "owner" {
  description = "Owner of the monitor."
  default = "nxnarbais"
}

variable "tags" {
  description = "List of custom tags to add" 
  type = list
  default = []
}
