variable "cluster" {
  description = "The name of the cluster"
}

variable "instance_group" {
  default     = "default"
  description = "The name of the instances that you consider as a group"
}

variable "environment" {
  description = "The name of the environment, e.g: staging"
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

variable "instance_type" {
  description = "The type of instances the ecs cluster should spawn"
}

variable "certificate_arn" {
  description = "The ssl certificate arn"
}

variable "subnets" {
  type        = list(string)
  description = "List of subnets from the chosen vpc"
}

variable "vpc_id" {
  description = "VPC to deploy the cluster to"
}

variable "cloudwatch_prefix" {
  description = "If you want to avoid cloudwatch collision or you don't want to merge all logs to one log group specify a prefix"
}