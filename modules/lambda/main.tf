# ==============================================================================
# modules/lambda/main.tf
# Three Lambda functions:
#   1. Scraper   – zip-based (webScraping.py)
#   2. Downloader – zip-based (downloader.py)
#   3. OCR/IA   – container image (package_type = "Image")
#
# Lambda Layer: {env}lyr{project}{description}{region}
# Naming:       {env}lmb{project}{description}{region}
# ==============================================================================

locals {
  name_scraper    = "${var.environment}lmb${var.project}scraperue1"
  name_downloader = "${var.environment}lmb${var.project}downloaderue1"
  name_ocr        = "${var.environment}lmb${var.project}ocrprocessorue1"
  name_layer      = "${var.environment}lyr${var.project}depsue1"
}

# ==============================================================================
# Lambda Layer – Python dependencies (pymongo, requests, etc.)
# Sourced from the S3 object uploaded by the s3 module.
# Attached to Lambda 1 (Scraper) and Lambda 2 (Downloader) only.
# Lambda 3 (container) bundles its own dependencies inside the image.
# ==============================================================================

resource "aws_lambda_layer_version" "deps" {
  layer_name          = local.name_layer
  description         = "AgroAlerta – Python runtime dependencies (pymongo, requests, beautifulsoup4, etc.)"
  compatible_runtimes = ["python3.11", "python3.12"]

  s3_bucket = var.resources_bucket_name
  s3_key    = var.layer_s3_key
}

# ==============================================================================
# Lambda 1 – Scraper (zip)
# ==============================================================================

data "archive_file" "scraper" {
  type        = "zip"
  source_file = "${path.root}/scripts/webScraping.py"
  output_path = "${path.module}/builds/scraper.zip"
}

resource "aws_lambda_function" "scraper" {
  function_name = local.name_scraper
  description   = "AgroAlerta – Web scraper for SENAMHI agroclimatic bulletins."
  role          = var.scraper_role_arn
  runtime       = var.lambda_runtime
  handler       = "webScraping.lambda_handler"
  timeout       = var.timeout_scraper
  memory_size   = var.memory_scraper

  filename         = data.archive_file.scraper.output_path
  source_code_hash = data.archive_file.scraper.output_base64sha256

  layers = [aws_lambda_layer_version.deps.arn]

  environment {
    variables = var.scraper_env_vars
  }

  tags = {
    Name = local.name_scraper
  }
}

# CloudWatch Log Group – explicit so it's managed by Terraform
resource "aws_cloudwatch_log_group" "scraper" {
  name              = "/aws/lambda/${local.name_scraper}"
  retention_in_days = 14
}

# ==============================================================================
# Lambda 2 – Downloader (zip)
# ==============================================================================

data "archive_file" "downloader" {
  type        = "zip"
  source_file = "${path.root}/scripts/downloader.py"
  output_path = "${path.module}/builds/downloader.zip"
}

resource "aws_lambda_function" "downloader" {
  function_name = local.name_downloader
  description   = "AgroAlerta – Downloads PDFs from SENAMHI and saves to S3."
  role          = var.downloader_role_arn
  runtime       = var.lambda_runtime
  handler       = "downloader.lambda_handler"
  timeout       = var.timeout_downloader
  memory_size   = var.memory_downloader

  filename         = data.archive_file.downloader.output_path
  source_code_hash = data.archive_file.downloader.output_base64sha256

  layers = [aws_lambda_layer_version.deps.arn]

  environment {
    variables = var.downloader_env_vars
  }

  tags = {
    Name = local.name_downloader
  }
}

resource "aws_cloudwatch_log_group" "downloader" {
  name              = "/aws/lambda/${local.name_downloader}"
  retention_in_days = 14
}

# ==============================================================================
# Lambda 3 – OCR/IA Processor (Container Image)
# CRITICAL: package_type = "Image" – no filename, no handler.
# The container image must be built and pushed to ECR before terraform apply.
# ==============================================================================

resource "aws_lambda_function" "ocr_processor" {
  function_name = local.name_ocr
  description   = "AgroAlerta – OCR geospatial processor with Gemini AI (container)."
  role          = var.ocr_role_arn
  package_type  = "Image"
  image_uri     = var.lambda_ocr_image_uri
  timeout       = var.timeout_ocr
  memory_size   = var.memory_ocr

  environment {
    variables = var.ocr_env_vars
  }

  tags = {
    Name = local.name_ocr
  }
}

resource "aws_cloudwatch_log_group" "ocr_processor" {
  name              = "/aws/lambda/${local.name_ocr}"
  retention_in_days = 30
}
