variable "intance_class" {
  description = "The instance type of the database"
}
variable "name" {
  description = "A name for the database"
}
variable "environment" {
  description = "The name of the environment, e.g: staging"
}
variable "vpc_id" {
  description = "The id of the vpc to deploy into"
}
variable "vpc_cidr" {
  description = "The cidr block of the vpc to limit access to internal only"
}
variable "db_username" {
  description = "Database username"
}