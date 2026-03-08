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

variable "schedule_expression" {
  description = "EventBridge schedule expression (cron or rate)."
  type        = string
  default     = "cron(0 1 ? * SUN *)"
}

variable "step_function_arn" {
  description = "ARN of the Step Functions state machine to trigger."
  type        = string
}

variable "step_function_role_arn" {
  description = "ARN of the IAM role that EventBridge uses to start the state machine."
  type        = string
}
