variable "environment" {
  description = "The name of the environment, e.g: staging"
}

variable "cluster" {
  description = "The name of the ecs cluster"
}

variable "subnets" {
  description = "The name of the ecs cluster"
}

variable "instance_type" {
  description = "The type of instances the ecs cluster should spawn"
}

variable "aws_ami" {
  description = "The instance AMI for the cluster images"
}

variable "max_size" {
  description = "The largest the ecs cluster will grow to"
}

variable "min_size" {
  description = "The smallest the ecs cluster will grow to"
}

variable "desired_capacity" {
  description = "The desired amount of instances ecs cluster aim for"
}

variable "instance_group" {
  default     = "default"
  description = "The name of the instances that you consider as a group"
}

variable "target_groups" {
  type        = list(string)
  default     = []
  description = "The target group arns to couple to the instances"
}

variable "vpc_id" {
  description = "The VPC id"
}

variable "iam_instance_profile_id" {
  description = "The id of the instance profile that should be used for the instances"
}

variable "ecs_config" {
  default     = "echo '' > /etc/ecs/ecs.config"
  description = "Specify ecs configuration or get it from S3. Example: aws s3 cp s3://some-bucket/ecs.config /etc/ecs/ecs.config"
}

variable "custom_userdata" {
  default     = ""
  description = "Inject extra command in the instance template to be run on boot"
}

variable "ecs_logging" {
  default     = "[\"json-file\",\"awslogs\"]"
  description = "Adding logging option to ECS that the Docker containers can use. It is possible to add fluentd as well"
}

variable "cloudwatch_prefix" {
  description = "If you want to avoid cloudwatch collision or you don't want to merge all logs to one log group specify a prefix"
}