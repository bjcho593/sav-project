variable "environment" {
  description = "El ambiente a desplegar: qa o prod"
  type        = string
}

variable "cloudflare_api_token" {
  description = "Token de API de Cloudflare"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "ID de la zona de tu dominio en Cloudflare"
  type        = string
}

variable "db_password" {
  description = "Contraseña maestra de la base de datos"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Tu dominio base (ej: mitesis.com)"
  type        = string
}