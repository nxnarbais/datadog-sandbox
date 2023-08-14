variable "aws_access_key_id" {
    default = ""
}

variable "aws_secret_access_key" {
    default = ""
}

variable "aws_session_token" {
    description = "Temporary session token used to create instances"
}

# Store Datadog API key in AWS Secrets Manager
variable "dd_api_key" {
  type        = string
  description = "Datadog API key"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

resource "aws_secretsmanager_secret" "dd_api_key" {
  name        = "datadog_api_key"
  description = "Encrypted Datadog API Key"
}

resource "aws_secretsmanager_secret_version" "dd_api_key" {
  secret_id     = aws_secretsmanager_secret.dd_api_key.id
  secret_string = var.dd_api_key
}

output "dd_api_key" {
  value = aws_secretsmanager_secret.dd_api_key.arn
}