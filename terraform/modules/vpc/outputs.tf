output "id" {
  value = aws_default_vpc.default.id
}

output "subnet_ids" {
  value = [
    aws_default_subnet.primary.id,
    aws_default_subnet.secondary.id,
    aws_default_subnet.tertiary.id,
  ]
}

output "cidr_block" {
  value = aws_default_vpc.default.cidr_block
}