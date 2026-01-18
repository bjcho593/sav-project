# Configuración de Terraform y Proveedor
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" 
}

# 1. VPC (Virtual Private Cloud) - La red privada del proyecto
resource "aws_vpc" "sav_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "SAV-Architecture-VPC" }
}

# 2. Subnet Pública (Para el servicio Identity que recibe peticiones)
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.sav_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
}

# 3. Security Group (Firewall)
resource "aws_security_group" "microservices_sg" {
  name   = "sav-sg"
  vpc_id = aws_vpc.sav_vpc.id

  # Puerto API (Identity)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Puertos TCP para comunicación interna (3001 a 3004)
  ingress {
    from_port   = 3001
    to_port     = 3004
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Cluster ECS (Para correr tus 5 microservicios)
resource "aws_ecs_cluster" "sav_cluster" {
  name = "sav-attendance-cluster"
}

# 5. Base de Datos RDS (PostgreSQL)
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  db_name              = "sav_db"
  engine               = "postgres"
  instance_class      = "db.t3.micro"
  username             = "admin_sav"
  password             = "password_tesis_2026"
  skip_final_snapshot  = true
}