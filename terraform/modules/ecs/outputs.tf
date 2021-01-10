output "default_alb_target_group" {
  value = module.alb.default_alb_target_group
}

output "alb_dns_name" {
  value = module.alb.dns_name
}

output "alb_zone_id" {
  value = module.alb.zone_id
}