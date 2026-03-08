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
