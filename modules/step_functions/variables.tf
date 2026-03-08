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

variable "step_functions_role_arn" {
  description = "IAM role ARN for the Step Functions state machine."
  type        = string
}

variable "scraper_function_arn" {
  description = "ARN of the Scraper Lambda function."
  type        = string
}

variable "downloader_function_arn" {
  description = "ARN of the Downloader Lambda function."
  type        = string
}

variable "ocr_processor_function_arn" {
  description = "ARN of the OCR/IA Processor Lambda function."
  type        = string
}
