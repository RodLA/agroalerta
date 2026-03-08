variable "environment" {
  description = "Deployment environment (stg | prd)."
  type        = string
}

variable "project" {
  description = "Short project code."
  type        = string
}

variable "region_short" {
  description = "Short region code (e.g. ue1)."
  type        = string
}

variable "resources_bucket_arn" {
  description = "ARN of the S3 resources bucket."
  type        = string
}

# Exact secret ARNs – used to scope IAM policies to minimum required access
variable "mongo_secret_arn" {
  description = "ARN of the MongoDB credentials secret in Secrets Manager."
  type        = string
}

variable "gemini_secret_arn" {
  description = "ARN of the Gemini API key secret in Secrets Manager."
  type        = string
}

variable "lambda_function_arns" {
  description = "ARNs of all Lambda functions Step Functions may invoke."
  type        = list(string)
  default     = ["*"]
}

variable "step_function_arns" {
  description = "ARNs of Step Function state machines EventBridge may start."
  type        = list(string)
  default     = ["*"]
}
