output "mongo_secret_arn" {
  description = "ARN of the MongoDB credentials secret."
  value       = aws_secretsmanager_secret.mongo.arn
}

output "mongo_secret_name" {
  description = "Name of the MongoDB credentials secret."
  value       = aws_secretsmanager_secret.mongo.name
}

output "gemini_secret_arn" {
  description = "ARN of the Gemini API key secret."
  value       = aws_secretsmanager_secret.gemini.arn
}

output "gemini_secret_name" {
  description = "Name of the Gemini API key secret."
  value       = aws_secretsmanager_secret.gemini.name
}
