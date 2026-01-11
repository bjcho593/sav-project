# --------------------------------------------------------
# 1. RED (VPC PROPIA - Requisito de Seguridad)
# --------------------------------------------------------
resource "aws_vpc" "sav_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "sav-vpc-${var.environment}" }
}

# Subred PÚBLICA (Aquí vive el Bastion y el Load Balancer)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.sav_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

# Subred PRIVADA (Aquí viven tus Apps y la BD - Nadie entra directo)
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.sav_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
}

# Gateway para que la red pública tenga internet
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.sav_vpc.id
}

# Rutas de red
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.sav_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# --------------------------------------------------------
# 2. SECURITY GROUPS & CORS
# --------------------------------------------------------

# SG Bastion: Solo acepta SSH TUYO
resource "aws_security_group" "bastion_sg" {
  name   = "sav-bastion-sg"
  vpc_id = aws_vpc.sav_vpc.id

  ingress {
    description = "SSH desde mi casa"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Idealmente pon tu IP real aquí
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

# SG App (Privada): Acepta HTTP del LB y SSH del Bastion
resource "aws_security_group" "app_sg" {
  name   = "sav-app-sg"
  vpc_id = aws_vpc.sav_vpc.id

  ingress {
    description     = "HTTP desde Load Balancer"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.lb_sg.id] # Ver abajo
  }
  ingress {
    description     = "SSH desde Bastion (JumpBox)"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

# SG Base de Datos: Solo acepta tráfico de la APP
resource "aws_security_group" "db_sg" {
  name   = "sav-db-sg"
  vpc_id = aws_vpc.sav_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
}

# --------------------------------------------------------
# 3. BASTION HOST (JUMPBOX) + IP ELÁSTICA
# --------------------------------------------------------
resource "aws_instance" "bastion" {
  ami           = "ami-053b0d53c279acc90" # Ubuntu
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
  key_name      = "sav-deploy-key"
  security_groups = [aws_security_group.bastion_sg.id]

  tags = { Name = "SAV-Bastion-JumpBox" }
}

# REQUISITO: IP Elástica para el Bastion
resource "aws_eip" "bastion_eip" {
  instance = aws_instance.bastion.id
  vpc      = true
}

# --------------------------------------------------------
# 4. BACKEND SERVERS (Microservicios)
# --------------------------------------------------------
# Nota: Si usas AutoScaling, las IPs son dinámicas. 
# Si el ing. exige IPs estáticas en APPs, usamos instancias fijas en vez de ASG.
resource "aws_instance" "app_server" {
  count         = 2 # Dos instancias para Alta Disponibilidad
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.private.id # En red privada
  key_name      = "sav-deploy-key"
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              # ... Script de instalación de Docker y Git ...
              EOF

  tags = { Name = "SAV-App-Server-${count.index}" }
}

# --------------------------------------------------------
# 5. BASE DE DATOS RDS (Integridad + Backups Automáticos)
# --------------------------------------------------------
resource "aws_db_instance" "default" {
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "14"
  instance_class         = "db.t3.micro"
  db_name                = "sav_db"
  username               = "admin_sav"
  password               = "password_super_seguro" # Usar Secrets Manager en prod real
  parameter_group_name   = "default.postgres14"
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.sav_db_subnet.name

  # REQUISITO: Backups Automáticos (Tipo Cron)
  backup_retention_period = 7      # Guarda backups de los últimos 7 días
  backup_window           = "03:00-04:00" # Hace backup todos los días a las 3 AM
  
  # REQUISITO: Integridad / Multi-AZ (Opcional por costo, recomendado por tesis)
  multi_az = false # Pon true para máxima integridad (cuesta más)
}

resource "aws_db_subnet_group" "sav_db_subnet" {
  name       = "sav-db-subnet-group"
  subnet_ids = [aws_subnet.private.id, aws_subnet.public.id] # RDS requiere 2 zonas min
}

# --------------------------------------------------------
# 6. CLOUDFLARE (Dominio)
# --------------------------------------------------------
# Asumiendo que tienes el provider configurado

resource "cloudflare_record" "app_dns" {
  zone_id = "TU_ZONE_ID_DE_CLOUDFLARE"
  name    = "app-${var.environment}" # Quedará app-qa.tudominio.com
  value   = aws_lb.app_lb.dns_name   # Apunta al balanceador de AWS
  type    = "CNAME"
  proxied = true # Activa la protección de Cloudflare (WAF, SSL)
}