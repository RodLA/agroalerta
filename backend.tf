terraform {
  # ---------------------------------------------------------------------------
  # IMPORTANT: Before first use, run scripts/bootstrap.sh to create the S3
  # bucket for remote state, then run "terraform init".
  #
  #   chmod +x scripts/bootstrap.sh && ./scripts/bootstrap.sh [aws-profile]
  # ---------------------------------------------------------------------------
  backend "s3" {
    bucket  = "stgs3agroterraformstateue1"
    key     = "agro-alerta/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
    profile = "agro-stg"
  }
}
