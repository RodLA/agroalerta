# ==============================================================================
# main.tf – Root Module (AgroAlerta)
# Wires together all child modules using the standard naming convention:
#   {env}{resource}{project}{description}{region}
# ==============================================================================

locals {
  prefix = "${var.environment}${var.project}${var.region_short}"
  # e.g. "stgagrogue1"  – individual modules append their resource abbreviation
}

# ------------------------------------------------------------------------------
# Module: S3
# Creates the resources bucket and uploads the Python scripts as S3 objects.
# ------------------------------------------------------------------------------
module "s3" {
  source = "./modules/s3"

  environment  = var.environment
  project      = var.project
  region_short = var.region_short
  scripts_dir  = var.scripts_dir
}

# ------------------------------------------------------------------------------
# Module: Secrets Manager
# Creates dummy-initialized secrets; real values are filled in manually.
# ------------------------------------------------------------------------------
module "secrets_manager" {
  source = "./modules/secrets_manager"

  environment  = var.environment
  project      = var.project
  region_short = var.region_short
}

# ------------------------------------------------------------------------------
# Module: IAM Roles
# Least-privilege roles for each Lambda and for Step Functions.
# ------------------------------------------------------------------------------
module "iam_roles" {
  source = "./modules/iam_roles"

  environment  = var.environment
  project      = var.project
  region_short = var.region_short

  # The S3 bucket ARN the Downloader & OCR Lambdas need access to
  resources_bucket_arn = module.s3.resources_bucket_arn

  # Exact secret ARNs from the secrets module (minimum privilege)
  mongo_secret_arn  = module.secrets_manager.mongo_secret_arn
  gemini_secret_arn = module.secrets_manager.gemini_secret_arn
}

# ------------------------------------------------------------------------------
# Module: Lambda Functions
# ------------------------------------------------------------------------------
module "lambda" {
  source = "./modules/lambda"

  environment  = var.environment
  project      = var.project
  region_short = var.region_short

  # IAM roles
  scraper_role_arn    = module.iam_roles.lambda_scraper_role_arn
  downloader_role_arn = module.iam_roles.lambda_downloader_role_arn
  ocr_role_arn        = module.iam_roles.lambda_ocr_role_arn

  # Runtime / sizing
  lambda_runtime = var.lambda_runtime

  timeout_scraper    = var.lambda_timeout_scraper
  timeout_downloader = var.lambda_timeout_downloader
  timeout_ocr        = var.lambda_timeout_ocr

  memory_scraper    = var.lambda_memory_scraper
  memory_downloader = var.lambda_memory_downloader
  memory_ocr        = var.lambda_memory_ocr

  # OCR Lambda container image (pre-built & pushed to ECR)
  lambda_ocr_image_uri = var.lambda_ocr_image_uri

  # Lambda Layer – S3 source (uploaded by the s3 module above)
  resources_bucket_name = module.s3.resources_bucket_name
  layer_s3_key          = module.s3.layer_s3_key

  # ---------- Scraper env vars ----------
  scraper_env_vars = {
    URL_TARGET        = var.scraper_url_target
    USER_AGENT        = var.scraper_user_agent
    MONGO_SECRET_NAME = module.secrets_manager.mongo_secret_name
    MONGO_DB_NAME     = var.scraper_mongo_db_name
    TABLE_METADATA    = var.scraper_table_metadata
    CULTIVOS_OBJETIVO = var.scraper_cultivos_objetivo
    MONTHS_TO_FETCH   = tostring(var.scraper_months_to_fetch)
  }

  # ---------- Downloader env vars ----------
  downloader_env_vars = {
    BUCKET_NAME       = module.s3.resources_bucket_name
    S3_BASE_FOLDER    = var.downloader_s3_base_folder
    MONGO_SECRET_NAME = module.secrets_manager.mongo_secret_name
    MONGO_DB_NAME     = var.downloader_mongo_db_name
    TABLE_METADATA    = var.downloader_table_metadata
  }

  # ---------- OCR/IA env vars ----------
  # GEMINI_API_KEY removed – Lambda reads it from Secrets Manager at runtime
  ocr_env_vars = {
    SECRET_NAME_GEMINI               = module.secrets_manager.gemini_secret_name
    MODEL_ID                         = var.ocr_model_id
    PROMPT_BUCKET                    = module.s3.resources_bucket_name
    KEY_ZIP                          = var.ocr_shapefile_key
    SECRET_NAME_MONGO                = module.secrets_manager.mongo_secret_name
    MONGO_DB_NAME                    = var.ocr_mongo_db_name
    TABLE_METADATA                   = var.ocr_table_metadata
    MONGO_COLLECTION_NAME            = var.ocr_collection_name
    MONGO_COLLECTION_RECOMMENDATIONS = var.ocr_collection_recommendations
    MONGO_COLLECTION_CROPS           = var.ocr_collection_crops
    MONGO_COLLECTION_EVENTS          = var.ocr_collection_events
    MONGO_COLLECTION_LOCATIONS       = var.ocr_collection_locations
    MONGO_COLLECTION_SOURCES         = var.ocr_collection_sources
    MONGO_COLLECTION_DOMAINS         = var.ocr_collection_domains
  }
}

# ------------------------------------------------------------------------------
# Module: Step Functions
# ------------------------------------------------------------------------------
module "step_functions" {
  source = "./modules/step_functions"

  environment  = var.environment
  project      = var.project
  region_short = var.region_short

  step_functions_role_arn    = module.iam_roles.step_functions_role_arn
  scraper_function_arn       = module.lambda.scraper_function_arn
  downloader_function_arn    = module.lambda.downloader_function_arn
  ocr_processor_function_arn = module.lambda.ocr_processor_function_arn
}

# ------------------------------------------------------------------------------
# Module: EventBridge
# ------------------------------------------------------------------------------
module "eventbridge" {
  source = "./modules/eventbridge"

  environment  = var.environment
  project      = var.project
  region_short = var.region_short

  schedule_expression    = var.eventbridge_schedule
  step_function_arn      = module.step_functions.state_machine_arn
  step_function_role_arn = module.iam_roles.eventbridge_role_arn
}
