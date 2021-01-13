module "ecs_roles" {
  source = "../ecs_roles"

  environment = var.environment
  cluster     = local.cluster
}

resource "aws_cloudwatch_log_group" "docker" {
  name              = "${var.cloudwatch_prefix}/var/log/docker"
  retention_in_days = 30
}

data "aws_region" "current" {}

data "template_file" "tasks" {
  template = file("${path.module}/services/bastion.json")

  vars = {
    log_group          = aws_cloudwatch_log_group.docker.name
    log_region         = data.aws_region.current.name
    environment        = var.environment
    task_arn           = module.ecs_roles.arn
    region             = data.aws_region.current.name
    ecr_repository_url = module.ecr.repository_url
  }
}

resource "aws_ecs_service" "webservices" {
  name    = "webservices-${var.environment}"
  cluster = local.cluster

  task_definition = aws_ecs_task_definition.default_task_definition.arn

  desired_count = 2
  launch_type   = "EC2"

  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  load_balancer {
    target_group_arn = module.ecs.default_alb_target_group
    container_name   = "nginx"
    container_port   = 80
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

resource "aws_ecs_task_definition" "default_task_definition" {
  family        = "${var.environment}_bastion"
  task_role_arn = module.ecs_roles.arn

  container_definitions = data.template_file.tasks.rendered
}