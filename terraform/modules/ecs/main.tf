data "aws_ami" "ecs_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["bottlerocket-aws-ecs-1-x86_64-v1.0.4-cef8dbd2"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_ecs_cluster" "cluster" {
  name = var.cluster
}

module "ecs_instances" {
  source = "../ecs_instances"

  environment = var.environment

  cluster        = aws_ecs_cluster.cluster.name
  instance_group = var.instance_group

  aws_ami       = data.aws_ami.ecs_ami.image_id
  instance_type = var.instance_type

  max_size         = var.max_size
  min_size         = var.min_size
  desired_capacity = var.desired_capacity

  subnets = var.subnets
  vpc_id  = var.vpc_id

  iam_instance_profile_id = aws_iam_instance_profile.ecs.id

  target_groups = [module.alb.default_alb_target_group]

  cloudwatch_prefix = var.cloudwatch_prefix
}