resource "aws_db_subnet_group" "sav_db_subnet" {
  name       = "sav-db-subnet-${var.environment}"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_db_instance" "postgres" {
  identifier             = "sav-db-${var.environment}"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "14"
  instance_class         = "db.t3.micro"
  db_name                = "sav_db"
  username               = "admin_sav"
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.sav_db_subnet.name
  skip_final_snapshot    = true

  # --- REQUISITOS DEL INGENIERO ---
  # 1. Backups Automáticos (One-Promise/Cron)
  backup_retention_period = 7       # Guarda 7 días
  backup_window           = "03:00-04:00" # A las 3 AM

  # 2. Integridad (Multi-AZ)
  # Pon 'true' para producción real. En Academy 'false' para ahorrar.
  multi_az = var.environment == "prod" ? true : false 
}