# ==============================================================================
# modules/secrets_manager/main.tf
# Creates AWS Secrets Manager secrets with dummy initial values.
# Use lifecycle { ignore_changes = [secret_string] } so that real credentials
# can be filled in manually after first deployment without Terraform overwriting them.
#
# Naming: {env}sec{project}{description}{region}
# ==============================================================================

locals {
  name_mongo  = "${var.environment}sec${var.project}mongoue1"
  name_gemini = "${var.environment}sec${var.project}geminiue1"
}

# ---------------------------------------------------------------------------
# MongoDB Credentials Secret
# ---------------------------------------------------------------------------

resource "aws_secretsmanager_secret" "mongo" {
  name                    = local.name_mongo
  description             = "AgroAlerta – MongoDB Atlas credentials (user, password, cluster)."
  recovery_window_in_days = 7

  tags = {
    Name = local.name_mongo
  }
}

resource "aws_secretsmanager_secret_version" "mongo" {
  secret_id = aws_secretsmanager_secret.mongo.id
  secret_string = jsonencode({
    user     = "temp"
    password = "temp"
    cluster  = "temp.mongodb.net"
    db_name  = "agroalerta"
  })

  lifecycle {
    # Prevent Terraform from overwriting manually-updated credentials.
    ignore_changes = [secret_string]
  }
}

# ---------------------------------------------------------------------------
# Gemini API Key Secret
# ---------------------------------------------------------------------------

resource "aws_secretsmanager_secret" "gemini" {
  name                    = local.name_gemini
  description             = "AgroAlerta – Google Gemini API key for the OCR/IA Lambda."
  recovery_window_in_days = 7

  tags = {
    Name = local.name_gemini
  }
}

resource "aws_secretsmanager_secret_version" "gemini" {
  secret_id = aws_secretsmanager_secret.gemini.id
  secret_string = jsonencode({
    api_key = "dummy_key"
  })

  lifecycle {
    # Prevent Terraform from overwriting manually-updated API key.
    ignore_changes = [secret_string]
  }
}
