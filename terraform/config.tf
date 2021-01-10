terraform {
  backend "s3" {
    bucket = "bastion-terraform"
    key    = "terraform"
    region = "eu-west-1"
  }
}

provider "aws" {
  profile = "default"
  region  = "eu-west-1"
}