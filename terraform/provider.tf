terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  # Credenciales se toman de variables de entorno (AWS Academy)
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}