output "scraper_function_arn" {
  description = "ARN of the Scraper Lambda function."
  value       = aws_lambda_function.scraper.arn
}

output "downloader_function_arn" {
  description = "ARN of the Downloader Lambda function."
  value       = aws_lambda_function.downloader.arn
}

output "ocr_processor_function_arn" {
  description = "ARN of the OCR/IA Processor Lambda function."
  value       = aws_lambda_function.ocr_processor.arn
}
