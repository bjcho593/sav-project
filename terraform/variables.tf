variable "aws_access_key" { type = string }
variable "aws_secret_key" { type = string }
variable "aws_session_token" { type = string }

variable "environment" {
  type    = string
  default = "dev"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "domain_name" {
  type    = string
  default = "sav-project.local"
}