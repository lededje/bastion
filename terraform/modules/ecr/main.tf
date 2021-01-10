resource "aws_ecr_repository" "bastion" {
  name                 = "bastion_${var.environment}"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}