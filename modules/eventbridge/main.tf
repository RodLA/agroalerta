# ==============================================================================
# modules/eventbridge/main.tf
# Creates an EventBridge rule that triggers the Step Functions state machine
# every Sunday at 01:00 AM UTC.
#
# Naming: {env}evb{project}{description}{region}
# ==============================================================================

locals {
  rule_name = "${var.environment}evb${var.project}weeklytrueue1"
}

resource "aws_cloudwatch_event_rule" "weekly_trigger" {
  name                = local.rule_name
  description         = "AgroAlerta – Weekly trigger: every Sunday at 01:00 AM UTC."
  schedule_expression = var.schedule_expression
  state               = "ENABLED"

  tags = {
    Name = local.rule_name
  }
}

resource "aws_cloudwatch_event_target" "step_function" {
  rule      = aws_cloudwatch_event_rule.weekly_trigger.name
  arn       = var.step_function_arn
  role_arn  = var.step_function_role_arn
  target_id = "${local.rule_name}-target"
}
