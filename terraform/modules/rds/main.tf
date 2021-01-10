resource "random_password" "password" {
  length = 32
  special = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_id" "master_password" {
  byte_length = 10
}

resource "aws_db_instance" "db" {
  identifier                = "db-${var.environment}-${var.name}"
  allocated_storage         = 20
  storage_type              = "gp2"
  engine                    = "postgres"
  engine_version            = "11.8"
  instance_class            = var.intance_class
  name                      = var.name
  backup_retention_period   = 7
  final_snapshot_identifier = "${var.name}-${var.environment}"
  backup_window             = "02:00-02:30"
  multi_az                  = "false"
  storage_encrypted         = "false"
  apply_immediately         = "false"
  monitoring_interval       = "60"
  username                  = var.db_username
  # Random password; change it when it's built else it will be stored in the tf s3 state.
  password                  = random_password.password.result 
  vpc_security_group_ids    = [aws_security_group.postgres.id]
  monitoring_role_arn       = aws_iam_role.rds_monitoring.arn

  # Skip final snapshot for environments that are not production
  skip_final_snapshot = var.environment != "production"

  tags = {
    Environment = var.environment
  }
}