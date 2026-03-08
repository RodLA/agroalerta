# ==============================================================================
# modules/iam_roles/main.tf
# Least-privilege IAM roles for:
#   - Lambda Scraper
#   - Lambda Downloader
#   - Lambda OCR/IA Processor
#   - Step Functions State Machine
#   - EventBridge (to trigger Step Functions)
#
# Naming: {env}iam{project}{description}{region}
# ==============================================================================

locals {
  role_scraper    = "${var.environment}iam${var.project}scraperue1"
  role_downloader = "${var.environment}iam${var.project}downloaderue1"
  role_ocr        = "${var.environment}iam${var.project}ocrprocessorue1"
  role_sfn        = "${var.environment}iam${var.project}stepfunctionsue1"
  role_evb        = "${var.environment}iam${var.project}eventbridgeue1"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ---------------------------------------------------------------------------
# Reusable assume-role policy documents
# ---------------------------------------------------------------------------

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "sfn_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "evb_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com", "events.amazonaws.com"]
    }
  }
}

# ==============================================================================
# LAMBDA 1 – SCRAPER
# Permissions: CloudWatch Logs + Secrets Manager (read secret for Mongo)
# ==============================================================================

resource "aws_iam_role" "lambda_scraper" {
  name               = local.role_scraper
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_scraper_policy" {
  # CloudWatch Logs
  statement {
    sid    = "AllowCloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*"]
  }

  # Secrets Manager – read MongoDB credentials
  statement {
    sid    = "AllowReadMongoSecret"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [var.mongo_secret_arn]
  }
}

resource "aws_iam_role_policy" "lambda_scraper" {
  name   = "${local.role_scraper}-policy"
  role   = aws_iam_role.lambda_scraper.id
  policy = data.aws_iam_policy_document.lambda_scraper_policy.json
}

# ==============================================================================
# LAMBDA 2 – DOWNLOADER
# Permissions: CloudWatch Logs + S3 write + Secrets Manager read
# ==============================================================================

resource "aws_iam_role" "lambda_downloader" {
  name               = local.role_downloader
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_downloader_policy" {
  statement {
    sid    = "AllowCloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*"]
  }

  # S3 – write PDFs to the resources bucket
  statement {
    sid    = "AllowS3PutObject"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]
    resources = ["${var.resources_bucket_arn}/resource/pdf/*"]
  }

  # Secrets Manager – MongoDB credentials
  statement {
    sid    = "AllowReadMongoSecret"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [var.mongo_secret_arn]
  }
}

resource "aws_iam_role_policy" "lambda_downloader" {
  name   = "${local.role_downloader}-policy"
  role   = aws_iam_role.lambda_downloader.id
  policy = data.aws_iam_policy_document.lambda_downloader_policy.json
}

# ==============================================================================
# LAMBDA 3 – OCR / IA PROCESSOR
# Permissions: CloudWatch Logs + S3 read/write (PDFs + Shapefile) + Secrets Manager
# ==============================================================================

resource "aws_iam_role" "lambda_ocr" {
  name               = local.role_ocr
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_ocr_policy" {
  statement {
    sid    = "AllowCloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*"]
  }

  # S3 – read PDFs and shapefiles, write processed outputs
  statement {
    sid    = "AllowS3ReadWrite"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${var.resources_bucket_arn}/*"]
  }

  statement {
    sid       = "AllowS3ListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [var.resources_bucket_arn]
  }

  # Secrets Manager – MongoDB credentials + Gemini API key
  statement {
    sid    = "AllowReadSecrets"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [var.mongo_secret_arn, var.gemini_secret_arn]
  }

  # ECR – pull container image (needed at runtime for container-based Lambda)
  statement {
    sid    = "AllowECRPull"
    effect = "Allow"
    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "lambda_ocr" {
  name   = "${local.role_ocr}-policy"
  role   = aws_iam_role.lambda_ocr.id
  policy = data.aws_iam_policy_document.lambda_ocr_policy.json
}

# ==============================================================================
# STEP FUNCTIONS – STATE MACHINE ROLE
# Permissions: invoke all three Lambda functions
# ==============================================================================

resource "aws_iam_role" "step_functions" {
  name               = local.role_sfn
  assume_role_policy = data.aws_iam_policy_document.sfn_assume.json
}

data "aws_iam_policy_document" "step_functions_policy" {
  statement {
    sid    = "AllowLambdaInvoke"
    effect = "Allow"
    actions = [
      "lambda:InvokeFunction",
    ]
    resources = var.lambda_function_arns
  }

  # CloudWatch Logs for X-Ray / execution history
  statement {
    sid    = "AllowCloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogDelivery",
      "logs:GetLogDelivery",
      "logs:UpdateLogDelivery",
      "logs:DeleteLogDelivery",
      "logs:ListLogDeliveries",
      "logs:PutResourcePolicy",
      "logs:DescribeResourcePolicies",
      "logs:DescribeLogGroups",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "step_functions" {
  name   = "${local.role_sfn}-policy"
  role   = aws_iam_role.step_functions.id
  policy = data.aws_iam_policy_document.step_functions_policy.json
}

# ==============================================================================
# EVENTBRIDGE – SCHEDULER ROLE
# Permissions: start Step Functions execution
# ==============================================================================

resource "aws_iam_role" "eventbridge" {
  name               = local.role_evb
  assume_role_policy = data.aws_iam_policy_document.evb_assume.json
}

data "aws_iam_policy_document" "eventbridge_policy" {
  statement {
    sid    = "AllowStartStepFunctions"
    effect = "Allow"
    actions = [
      "states:StartExecution",
    ]
    resources = var.step_function_arns
  }
}

resource "aws_iam_role_policy" "eventbridge" {
  name   = "${local.role_evb}-policy"
  role   = aws_iam_role.eventbridge.id
  policy = data.aws_iam_policy_document.eventbridge_policy.json
}
