variable "alb_name" {
  default     = "default"
  description = "The name of the loadbalancer"
}

variable "environment" {
  description = "The name of the environment"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet ids to place the loadbalancer in"
}

variable "vpc_id" {
  description = "The VPC id"
}

variable "deregistration_delay" {
  default     = "300"
  description = "The default deregistration delay"
}

variable "health_check_path" {
  default     = "/"
  description = "The default health check path"
}

variable "allow_cidr_block" {
  default     = "0.0.0.0/0"
  description = "Specify cird block that is allowd to acces the LoadBalancer"
}

variable "certificate_arn" {
  description = "The arn of the certificiate the alb should be using"
}