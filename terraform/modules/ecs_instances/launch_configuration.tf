resource "aws_launch_configuration" "launch" {
  name_prefix          = "${var.cluster}_${var.instance_group}_${var.environment}__"
  image_id             = var.aws_ami
  instance_type        = var.instance_type
  security_groups      = [aws_security_group.instance.id]
  iam_instance_profile = var.iam_instance_profile_id
  user_data            = data.template_file.user_data.rendered

  # aws_launch_configuration can not be modified.
  # Therefore we use create_before_destroy so that a new modified aws_launch_configuration can be created
  # before the old one get's destroyed. That's why we use name_prefix instead of name.
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "asg" {
  name                 = "${var.cluster}_${var.instance_group}_${var.environment}"
  max_size             = var.max_size
  min_size             = var.min_size
  desired_capacity     = var.desired_capacity
  force_delete         = true
  launch_configuration = aws_launch_configuration.launch.id
  vpc_zone_identifier  = var.subnets

  tag {
    key                 = "Name"
    value               = "ecs_${var.cluster}_${var.instance_group}_${var.environment}"
    propagate_at_launch = "true"
  }

  tag {
    key                 = "Environment"
    value               = var.environment
    propagate_at_launch = "true"
  }

  tag {
    key                 = "Cluster"
    value               = var.cluster
    propagate_at_launch = "true"
  }

  tag {
    key                 = "InstanceGroup"
    value               = var.instance_group
    propagate_at_launch = "true"
  }
}

data "template_file" "user_data" {
  template = file("${path.module}/templates/userdata.toml")

  vars = {
    cluster_name      = var.cluster
  }
}