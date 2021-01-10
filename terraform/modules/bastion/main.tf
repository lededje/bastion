locals {
  cluster = "bastion-${var.environment}"
}

module "vpc" {
  source = "../vpc"
}

module "rds" {
  source = "../rds"

  environment   = var.environment
  intance_class = var.db_instance_class
  name          = "bastion"
  vpc_id        = module.vpc.id
  vpc_cidr      = module.vpc.cidr_block
  db_username   = var.db_username
}

module "ecs" {
  source = "../ecs"

  cluster = local.cluster

  environment = var.environment

  max_size         = var.max_size
  min_size         = var.min_size
  instance_type    = var.instance_type
  desired_capacity = var.desired_capacity

  certificate_arn = module.domain.certificate_arn

  cloudwatch_prefix = var.cloudwatch_prefix

  subnets = module.vpc.subnet_ids
  vpc_id  = module.vpc.id
}

module "domain" {
  source = "../domain"

  domain    = var.domain
  subdomain = var.subdomain

  environment = var.environment

  alb_dns_name = module.ecs.alb_dns_name
  alb_zone_id  = module.ecs.alb_zone_id
}