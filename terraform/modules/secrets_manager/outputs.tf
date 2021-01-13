output "secret_store_arn" {
  value = aws_secretsmanager_secret.default_store.arn
}

output "secret_store_name" {
  value = aws_secretsmanager_secret.default_store.name
}
