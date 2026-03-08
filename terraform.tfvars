# ==============================================================================
# terraform.tfvars  –  Staging Environment
# ==============================================================================
# Fill in ALL values marked with <CHANGE_ME> before running terraform apply.
# Never commit sensitive values (API keys, secret names) to source control.
# ==============================================================================

# ---- Global ----
environment  = "stg"
aws_region   = "us-east-1"
project      = "agro"
region_short = "ue1"

# ---- Lambda runtime ----
lambda_runtime = "python3.11"

lambda_timeout_scraper    = 120
lambda_timeout_downloader = 120
lambda_timeout_ocr        = 900

lambda_memory_scraper    = 256
lambda_memory_downloader = 256
lambda_memory_ocr        = 3008

# ---- Lambda 1: Scraper – environment variables ----
scraper_url_target        = "https://www.senamhi.gob.pe/?p=riesgo-agro"
scraper_user_agent        = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Monitor-Agro-Bot"
scraper_mongo_secret_name = "stgsecagromongoue1"
scraper_mongo_db_name     = "agroalerta"
scraper_table_metadata    = "metadata"
# scraper_cultivos_objetivo = "papa,maíz,maiz,arroz,café,cafe,cacao"
scraper_cultivos_objetivo = "cacao"
scraper_months_to_fetch   = 2

# ---- Lambda 2: Downloader – environment variables ----
downloader_s3_base_folder    = "resource/pdf/senamhi"
downloader_mongo_secret_name = "stgsecagromongoue1"
downloader_mongo_db_name     = "agroalerta"
downloader_table_metadata    = "metadata"

# ---- Lambda 3: OCR/IA – environment variables ----
# Credentials are managed exclusively via Secrets Manager (stgsecagromongoue1 / stgsecagrogeminiue1).
ocr_gemini_secret_name         = "stgsecagrogeminiue1"
ocr_model_id                   = "models/gemini-2.5-flash"
ocr_shapefile_key              = "resource/shapefile/Provincial_INEI_2023.zip"
ocr_mongo_secret_name          = "stgsecagromongoue1"
ocr_mongo_db_name              = "agroalerta"
ocr_table_metadata             = "metadata"
ocr_collection_name            = "documents_risk_alerts"
ocr_collection_recommendations = "alerts_recommendations"
ocr_collection_crops           = "crops"
ocr_collection_events          = "events"
ocr_collection_locations       = "locations"
ocr_collection_sources         = "official_sources"
ocr_collection_domains         = "domains"

# ECR image URI for the OCR Lambda container (build & push before terraform apply)
# Format: <account_id>.dkr.ecr.us-east-1.amazonaws.com/<repo_name>:<tag>
lambda_ocr_image_uri = "010594764766.dkr.ecr.us-east-1.amazonaws.com/stgecragroocrprocessorue1:latest"

# ---- EventBridge ----
eventbridge_schedule = "cron(0 1 ? * SUN *)"
