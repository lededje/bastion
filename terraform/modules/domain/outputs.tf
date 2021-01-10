output "aws_route53_name_servers" {
  value = aws_route53_zone.default.name_servers
}

output "certificate_arn" {
  value = aws_acm_certificate.default.arn
}