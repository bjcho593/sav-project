# SG Bastion: Solo acepta SSH (Idealmente de tu IP, aqui abierto 0.0.0.0/0 por facilidad)
resource "aws_security_group" "bastion_sg" {
  name   = "sav-bastion-sg-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

# SG Load Balancer: Abierto al mundo (HTTP/HTTPS)
resource "aws_security_group" "lb_sg" {
  name   = "sav-lb-sg-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 80
    to_port   = 80
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

# SG App Privada: Solo acepta tráfico del LB y del Bastion
resource "aws_security_group" "app_sg" {
  name   = "sav-app-sg-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "HTTP desde Load Balancer"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.lb_sg.id]
  }
  ingress {
    description     = "SSH desde Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

# SG Base de Datos: Solo acepta tráfico de la App
resource "aws_security_group" "db_sg" {
  name   = "sav-db-sg-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
}