resource "aws_secretsmanager_secret" "default_store" {
  name = "bastion_${var.environment}"

  tags = {
    Environment = var.environment
  }
}
