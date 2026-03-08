# ==============================================================================
# outputs.tf – Root Module
# ==============================================================================

output "resources_bucket_name" {
  description = "Name of the S3 resources bucket."
  value       = module.s3.resources_bucket_name
}

output "resources_bucket_arn" {
  description = "ARN of the S3 resources bucket."
  value       = module.s3.resources_bucket_arn
}

output "lambda_scraper_arn" {
  description = "ARN of the Scraper Lambda function."
  value       = module.lambda.scraper_function_arn
}

output "lambda_downloader_arn" {
  description = "ARN of the Downloader Lambda function."
  value       = module.lambda.downloader_function_arn
}

output "lambda_ocr_processor_arn" {
  description = "ARN of the OCR/IA Lambda function."
  value       = module.lambda.ocr_processor_function_arn
}

output "state_machine_arn" {
  description = "ARN of the Step Functions state machine."
  value       = module.step_functions.state_machine_arn
}

output "eventbridge_rule_arn" {
  description = "ARN of the EventBridge trigger rule."
  value       = module.eventbridge.rule_arn
}
