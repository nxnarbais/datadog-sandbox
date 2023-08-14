
provider "aws" {
  region = var.region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
  token = var.aws_session_token
}

# Use the Datadog Forwarder to ship logs from S3 and CloudWatch, as well as observability data from Lambda functions to Datadog. For more information, see https://github.com/DataDog/datadog-serverless-functions/tree/master/aws/logs_monitoring
resource "aws_cloudformation_stack" "narbais_datadog_forwarder" {
  name         = "narbais-datadog-forwarder"
  capabilities = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"]
  parameters   = {
    DdApiKeySecretArn  = "REPLACE ME WITH THE SECRETS ARN",
    DdApiKeySecretArn  = aws_secretsmanager_secret.dd_api_key.arn,
    # DdSite             = "<code class="js-region-param region-param" data-region-param="dd_site"></code>",
    DdSite             = "datadoghq.com",
    FunctionName       = "datadog-forwarder"
  }
  template_url = "https://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml"
}