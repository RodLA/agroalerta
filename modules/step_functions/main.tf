# ==============================================================================
# modules/step_functions/main.tf
# Deploys the AgroAlerta Step Functions state machine.
#
# The state machine definition is stored in templates/state_machine.json and
# loaded at plan time via templatefile(). Lambda ARNs are injected dynamically,
# replacing the previously hard-coded values.
#
# Naming: {env}sfn{project}{description}{region}
# ==============================================================================

locals {
  state_machine_name = "${var.environment}sfn${var.project}pipelineue1"
}

resource "aws_sfn_state_machine" "pipeline" {
  name     = local.state_machine_name
  role_arn = var.step_functions_role_arn

  definition = templatefile("${path.module}/templates/state_machine.json", {
    scraper_function_arn       = var.scraper_function_arn
    downloader_function_arn    = var.downloader_function_arn
    ocr_processor_function_arn = var.ocr_processor_function_arn
  })

  tags = {
    Name = local.state_machine_name
  }
}
