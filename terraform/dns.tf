resource "cloudflare_record" "app" {
  zone_id = var.cloudflare_zone_id
  # Si es QA -> qa.tusitio.com | Si es Prod -> app.tusitio.com
  name    = var.environment == "prod" ? "app" : "qa"
  value   = aws_lb.app_lb.dns_name
  type    = "CNAME"
  proxied = true
}