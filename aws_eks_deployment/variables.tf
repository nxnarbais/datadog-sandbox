variable "aws_access_key_id" {
    default = ""
}

variable "aws_secret_access_key" {
    default = ""
}

variable "aws_session_token" {
    description = "Temporary session token used to create instances"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}