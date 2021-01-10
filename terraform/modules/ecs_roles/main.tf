data "aws_iam_policy_document" "ecs_task_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_role_policy" {
  statement {
    actions   = ["ssm:DescribeParameters"]
    effect    = "Allow"
    resources = ["*"]
  }

  statement {
    actions   = ["ssm:GetParameter"]
    effect    = "Allow"
    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "ssm:resourceTag/Environment"
      values   = [var.environment]
    }
  }
}

resource "aws_iam_role" "ecs_default_task" {
  name = "${var.environment}_${var.cluster}_task"
  path = "/"

  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role_policy.json
}

resource "aws_iam_policy" "ecs_default_task" {
  name = "${var.environment}_${var.cluster}_ecs_task"
  path = "/"

  policy = data.aws_iam_policy_document.ecs_role_policy.json
}

resource "aws_iam_policy_attachment" "ecs_default_task" {
  name       = "${var.environment}_${var.cluster}_ecs_task"
  roles      = [aws_iam_role.ecs_default_task.name]
  policy_arn = aws_iam_policy.ecs_default_task.arn
}