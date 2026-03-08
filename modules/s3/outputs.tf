output "resources_bucket_name" {
  description = "Name of the S3 resources bucket."
  value       = aws_s3_bucket.resources.id
}

output "resources_bucket_arn" {
  description = "ARN of the S3 resources bucket."
  value       = aws_s3_bucket.resources.arn
}

output "layer_s3_key" {
  description = "S3 key of the uploaded Lambda layer zip."
  value       = aws_s3_object.layer_deps.key
}
