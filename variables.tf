# ==============================================================================
# GLOBAL
# ==============================================================================

variable "aws_region" {
  description = "AWS Region where resources will be deployed."
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS named profile to use for authentication. Allows multi-account deployments without relying on the system default credentials."
  type        = string
  default     = "agro-stg"
}

variable "environment" {
  description = "Deployment environment. Allowed: stg | prd."
  type        = string
  validation {
    condition     = contains(["stg", "prd"], var.environment)
    error_message = "environment must be 'stg' or 'prd'."
  }
}

variable "project" {
  description = "Short project code used in resource naming."
  type        = string
  default     = "agro"
}

variable "region_short" {
  description = "Short region code used in resource naming (ue1 = us-east-1)."
  type        = string
  default     = "ue1"
}

# ==============================================================================
# S3
# ==============================================================================

variable "scripts_dir" {
  description = "Local path to the Python scripts directory."
  type        = string
  default     = "./scripts"
}

# ==============================================================================
# LAMBDA – general
# ==============================================================================

variable "lambda_runtime" {
  description = "Runtime for zip-based Lambdas (Scraper & Downloader)."
  type        = string
  default     = "python3.11"
}

variable "lambda_timeout_scraper" {
  description = "Timeout in seconds for the Scraper Lambda."
  type        = number
  default     = 120
}

variable "lambda_timeout_downloader" {
  description = "Timeout in seconds for the Downloader Lambda."
  type        = number
  default     = 120
}

variable "lambda_timeout_ocr" {
  description = "Timeout in seconds for the OCR/IA Lambda (container)."
  type        = number
  default     = 900
}

variable "lambda_memory_scraper" {
  description = "Memory (MB) for the Scraper Lambda."
  type        = number
  default     = 256
}

variable "lambda_memory_downloader" {
  description = "Memory (MB) for the Downloader Lambda."
  type        = number
  default     = 256
}

variable "lambda_memory_ocr" {
  description = "Memory (MB) for the OCR/IA Lambda (container)."
  type        = number
  default     = 3008
}

# ==============================================================================
# LAMBDA – environment variables (extracted from Python source)
# ==============================================================================

# ---- Lambda 1: Scraper ----
variable "scraper_url_target" {
  description = "Target URL for scraping (Senamhi portal)."
  type        = string
  default     = "https://www.senamhi.gob.pe/?p=riesgo-agro"
}

variable "scraper_user_agent" {
  description = "HTTP User-Agent header sent by the Scraper."
  type        = string
  default     = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Monitor-Agro-Bot"
}

variable "scraper_mongo_secret_name" {
  description = "Secrets Manager secret name holding MongoDB credentials (Scraper)."
  type        = string
}

variable "scraper_mongo_db_name" {
  description = "MongoDB database name used by the Scraper."
  type        = string
  default     = "agroalerta"
}

variable "scraper_table_metadata" {
  description = "MongoDB collection name for metadata (Scraper)."
  type        = string
  default     = "metadata"
}

variable "scraper_cultivos_objetivo" {
  description = "Comma-separated list of target crops for filtering."
  type        = string
  default     = "papa,maíz,maiz,arroz,café,cafe,cacao"
}

variable "scraper_months_to_fetch" {
  description = "How many past months to consider when scraping links."
  type        = number
  default     = 3
}

# ---- Lambda 2: Downloader ----
variable "downloader_s3_base_folder" {
  description = "S3 prefix for downloaded PDFs."
  type        = string
  default     = "resource/pdf/senamhi"
}

variable "downloader_mongo_secret_name" {
  description = "Secrets Manager secret name holding MongoDB credentials (Downloader)."
  type        = string
}

variable "downloader_mongo_db_name" {
  description = "MongoDB database name used by the Downloader."
  type        = string
  default     = "agroalerta"
}

variable "downloader_table_metadata" {
  description = "MongoDB collection name for metadata (Downloader)."
  type        = string
  default     = "metadata"
}

# ---- Lambda 3: OCR/IA ----
variable "ocr_gemini_secret_name" {
  description = "Secrets Manager secret name holding the Gemini API key (OCR/IA Lambda)."
  type        = string
  default     = "stgsecagrogeminiue1"
}

variable "ocr_model_id" {
  description = "Gemini model identifier."
  type        = string
  default     = "gemini-2.0-flash"
}

variable "ocr_shapefile_key" {
  description = "S3 key for the zipped shapefile used in geospatial processing."
  type        = string
}

variable "ocr_mongo_secret_name" {
  description = "Secrets Manager secret name holding MongoDB credentials (OCR)."
  type        = string
}

variable "ocr_mongo_db_name" {
  description = "MongoDB database name used by the OCR Lambda."
  type        = string
  default     = "agroalerta"
}

variable "ocr_table_metadata" {
  description = "MongoDB metadata collection name (OCR)."
  type        = string
  default     = "metadata"
}

variable "ocr_collection_name" {
  description = "MongoDB collection for geospatial risk records."
  type        = string
  default     = "boletines_resultados"
}

variable "ocr_collection_recommendations" {
  description = "MongoDB collection for AI recommendations."
  type        = string
  default     = "boletines_recommendations"
}

variable "ocr_collection_crops" {
  description = "MongoDB collection for crop catalog."
  type        = string
  default     = "crops"
}

variable "ocr_collection_events" {
  description = "MongoDB collection for event catalog."
  type        = string
  default     = "events"
}

variable "ocr_collection_locations" {
  description = "MongoDB collection for location catalog."
  type        = string
  default     = "locations"
}

variable "ocr_collection_sources" {
  description = "MongoDB collection for official sources."
  type        = string
  default     = "official_sources"
}

variable "ocr_collection_domains" {
  description = "MongoDB collection for Senamhi domains."
  type        = string
  default     = "domains"
}

# Container image URI is required for Lambda 3 (no local build here)
variable "lambda_ocr_image_uri" {
  description = "ECR container image URI for the OCR/IA Lambda (package_type = Image)."
  type        = string
}

# ==============================================================================
# EVENTBRIDGE
# ==============================================================================

variable "eventbridge_schedule" {
  description = "EventBridge cron expression for the pipeline trigger."
  type        = string
  default     = "cron(0 1 ? * SUN *)"
}
