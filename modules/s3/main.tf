# ==============================================================================
# modules/s3/main.tf
# Creates the resources S3 bucket and uploads Python scripts as S3 objects.
# Naming: {env}s3{project}{description}{region}
# ==============================================================================

locals {
  bucket_name = "${var.environment}s3${var.project}recursosue1"
  # e.g. stgs3agrorecursosue1
}

resource "aws_s3_bucket" "resources" {
  bucket        = local.bucket_name
  force_destroy = false

  tags = {
    Name = local.bucket_name
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "resources" {
  bucket = aws_s3_bucket.resources.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enforce Server-Side Encryption (SSE-S3)
resource "aws_s3_bucket_server_side_encryption_configuration" "resources" {
  bucket = aws_s3_bucket.resources.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Enable versioning for auditability
resource "aws_s3_bucket_versioning" "resources" {
  bucket = aws_s3_bucket.resources.id

  versioning_configuration {
    status = "Enabled"
  }
}

# ---------------------------------------------------------------------------
# Upload Python scripts from ./scripts/ to S3
# Iterates over all .py files in the scripts directory.
# ---------------------------------------------------------------------------

locals {
  # Upload only .py files at the root of scripts/ — excludes the Docker source
  # subfolder stglmbagroocrprocessorue1/ which is used for manual ECR image builds.
  all_scripts = fileset(var.scripts_dir, "*.py")
  scripts     = { for f in local.all_scripts : f => f if !startswith(f, "stglmbagroocrprocessorue1") }
}

resource "aws_s3_object" "scripts" {
  for_each = local.scripts

  bucket       = aws_s3_bucket.resources.id
  key          = "scripts/${each.value}"
  source       = "${var.scripts_dir}/${each.value}"
  content_type = "text/x-python"
  etag         = filemd5("${var.scripts_dir}/${each.value}")
}

# ---------------------------------------------------------------------------
# Upload Lambda Layer zip to S3
# ---------------------------------------------------------------------------

resource "aws_s3_object" "layer_deps" {
  bucket       = aws_s3_bucket.resources.id
  key          = "layers/${var.layer_zip_filename}"
  source       = "${var.layers_dir}/${var.layer_zip_filename}"
  content_type = "application/zip"
  etag         = filemd5("${var.layers_dir}/${var.layer_zip_filename}")
}

# ---------------------------------------------------------------------------
# Backup: source code zip of Lambda 3 (OCR/IA)
# The Lambda itself runs from an ECR container image; this object provides
# a contingency copy of the source at backups/stglmbagroocrprocessorue1.zip.
# Terraform re-uploads automatically when the file changes (etag = filemd5).
# ---------------------------------------------------------------------------

resource "aws_s3_object" "ocr_source_backup" {
  bucket       = aws_s3_bucket.resources.id
  key          = "backups/stglmbagroocrprocessorue1.zip"
  source       = "${path.root}/scripts/stglmbagroocrprocessorue1.zip"
  content_type = "application/zip"
  etag         = filemd5("${path.root}/scripts/stglmbagroocrprocessorue1.zip")
}

# ---------------------------------------------------------------------------
# Shapefile: Peru provincias (used by Lambda 3 OCR for geospatial processing)
# Local path : resource/peru_provincias.zip
# S3 key     : resource/shapefile/peru_provincias.zip  (matches ocr_shapefile_key)
# ---------------------------------------------------------------------------

resource "aws_s3_object" "shapefile" {
  bucket       = aws_s3_bucket.resources.id
  key          = "resource/shapefile/Provincial_INEI_2023.zip"
  source       = "${path.root}/resource/Provincial_INEI_2023.zip"
  content_type = "application/zip"
  etag         = filemd5("${path.root}/resource/Provincial_INEI_2023.zip")
}

