module "staging" {
  source = "./modules/bastion"

  domain      = "lastbastion.app"
  subdomain   = "staging"
  environment = "staging"

  max_size         = 2
  min_size         = 1
  desired_capacity = 1
  instance_type    = "t3.micro"

  db_username       = var.db_username
  db_instance_class = "db.t3.micro"
}