#!/usr/bin/env bash
# ==============================================================================
# scripts/bootstrap.sh
# One-time setup: creates the S3 bucket for Terraform remote state.
# Run this BEFORE the first "terraform init".
#
# Usage:
#   chmod +x scripts/bootstrap.sh
#   ./scripts/bootstrap.sh [profile]   # profile defaults to agro-stg
# ==============================================================================

set -euo pipefail

PROFILE="${1:-agro-stg}"
BUCKET="stgs3agroterraformstateue1"
REGION="us-east-1"

echo "▶ Bootstrap – using AWS profile: $PROFILE"

# ---------------------------------------------------------------------------
# S3 Bucket – Terraform state
# ---------------------------------------------------------------------------
echo "▶ Creating S3 bucket: $BUCKET ..."

aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$REGION" \
  --profile "$PROFILE"

echo "▶ Enabling versioning on $BUCKET ..."

aws s3api put-bucket-versioning \
  --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled \
  --profile "$PROFILE"

echo "▶ Blocking public access on $BUCKET ..."

aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile "$PROFILE"

echo ""
echo "✅ Bootstrap complete."
echo "   State bucket : s3://$BUCKET"
echo ""
echo "   You can now run:"
echo "     terraform init"
echo "     terraform plan -out=tfplan"
echo "     terraform apply tfplan"
