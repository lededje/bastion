data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_default_vpc" "default" {
  tags = {
    name = "Default VPC"
  }
}

resource "aws_default_subnet" "primary" {
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "Default subnet for ${data.aws_availability_zones.available.names[0]}"
  }
}

resource "aws_default_subnet" "secondary" {
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "Default subnet for ${data.aws_availability_zones.available.names[1]}"
  }
}

resource "aws_default_subnet" "tertiary" {
  availability_zone = data.aws_availability_zones.available.names[2]

  tags = {
    Name = "Default subnet for ${data.aws_availability_zones.available.names[2]}"
  }
}