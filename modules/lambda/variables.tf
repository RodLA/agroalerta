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

# S3 source for the Lambda Layer
variable "resources_bucket_name" {
  description = "Name of the S3 bucket where the layer zip was uploaded."
  type        = string
}

variable "layer_s3_key" {
  description = "S3 key of the Lambda layer zip (e.g. layers/stglyragrodepsue1.zip)."
  type        = string
}

# IAM roles
variable "scraper_role_arn" {
  description = "ARN of the IAM role for the Scraper Lambda."
  type        = string
}

variable "downloader_role_arn" {
  description = "ARN of the IAM role for the Downloader Lambda."
  type        = string
}

variable "ocr_role_arn" {
  description = "ARN of the IAM role for the OCR/IA Lambda."
  type        = string
}

# Runtime
variable "lambda_runtime" {
  description = "Runtime for zip-based Lambdas."
  type        = string
  default     = "python3.11"
}

variable "timeout_scraper" {
  type    = number
  default = 120
}

variable "timeout_downloader" {
  type    = number
  default = 120
}

variable "timeout_ocr" {
  type    = number
  default = 900
}

variable "memory_scraper" {
  type    = number
  default = 256
}

variable "memory_downloader" {
  type    = number
  default = 256
}

variable "memory_ocr" {
  type    = number
  default = 3008
}

# Container image for the OCR Lambda
variable "lambda_ocr_image_uri" {
  description = "ECR image URI for the OCR/IA Lambda."
  type        = string
}

# Environment variable maps
variable "scraper_env_vars" {
  description = "Environment variables for the Scraper Lambda."
  type        = map(string)
  default     = {}
}

variable "downloader_env_vars" {
  description = "Environment variables for the Downloader Lambda."
  type        = map(string)
  default     = {}
}

variable "ocr_env_vars" {
  description = "Environment variables for the OCR/IA Lambda."
  type        = map(string)
  default     = {}
}
