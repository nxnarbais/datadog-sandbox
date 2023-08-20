variable "notifications" {
  type = map
  default = {
    email = "my_email@ddog.com"
  }
}

variable "owner" {
  description = "Owner of the synthetic test."
  default = "nxnarbais"
}

variable "tags" {
  description = "List of custom tags to add" 
  type = list
  default = ["env:prod", "updated:2022-05-01"]
}

variable "url_list" {
  description = "List of URL to test"
  type = list
  default = ["https://www.google.com", "https://www.twitter.com", "https://example.org", "https://shopist.io"]
}