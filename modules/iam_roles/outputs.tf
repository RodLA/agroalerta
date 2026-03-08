output "lambda_scraper_role_arn" {
  description = "ARN of the IAM role for the Scraper Lambda."
  value       = aws_iam_role.lambda_scraper.arn
}

output "lambda_downloader_role_arn" {
  description = "ARN of the IAM role for the Downloader Lambda."
  value       = aws_iam_role.lambda_downloader.arn
}

output "lambda_ocr_role_arn" {
  description = "ARN of the IAM role for the OCR/IA Lambda."
  value       = aws_iam_role.lambda_ocr.arn
}

output "step_functions_role_arn" {
  description = "ARN of the IAM role for the Step Functions state machine."
  value       = aws_iam_role.step_functions.arn
}

output "eventbridge_role_arn" {
  description = "ARN of the IAM role for EventBridge scheduler."
  value       = aws_iam_role.eventbridge.arn
}
