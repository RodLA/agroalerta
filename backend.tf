terraform {
  # ---------------------------------------------------------------------------
  # IMPORTANT: Before first use, create the S3 bucket for state manually:
  #
  #   aws s3api create-bucket \
  #     --bucket stgs3agroterraformstateue1 \
  #     --region us-east-1
  #
  #   aws s3api put-bucket-versioning \
  #     --bucket stgs3agroterraformstateue1 \
  #     --versioning-configuration Status=Enabled
  #
  #   aws dynamodb create-table \
  #     --table-name stgs3agroterraform-lock \
  #     --attribute-definitions AttributeName=LockID,AttributeType=S \
  #     --key-schema AttributeName=LockID,KeyType=HASH \
  #     --billing-mode PAY_PER_REQUEST \
  #     --region us-east-1
  # ---------------------------------------------------------------------------
  backend "s3" {
    bucket         = "stgs3agroterraformstateue1"
    key            = "agro-alerta/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "stgs3agroterraform-lock"
  }
}
