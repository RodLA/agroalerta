variable "environment" {
  description = "Deployment environment (stg | prd)."
  type        = string
}

variable "project" {
  description = "Short project code."
  type        = string
}

variable "region_short" {
  description = "Short region code (e.g. ue1)."
  type        = string
}

variable "scripts_dir" {
  description = "Path to the local Python scripts directory."
  type        = string
  default     = "./scripts"
}

variable "layers_dir" {
  description = "Path to the local Lambda layers directory."
  type        = string
  default     = "./layers"
}

variable "layer_zip_filename" {
  description = "Filename of the Lambda layer zip (stored in layers_dir and uploaded to S3)."
  type        = string
  default     = "stglyragrodepsue1.zip"
}
