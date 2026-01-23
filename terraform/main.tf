# Instancia para el Backend de Smart Attendance Verification
resource "aws_instance" "sav_backend" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS
  instance_type = "t3.medium"
  key_name      = "vockey" # Llave estándar de AWS Academy

  vpc_security_group_ids = [aws_security_group.sav_sg.id]

  # Instalación automática de dependencias
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io docker-compose
              sudo systemctl start docker
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "sav-backend-${var.environment}"
  }
}

# Firewall del sistema
resource "aws_security_group" "sav_sg" {
  name        = "sav-sg-${var.environment}"
  description = "Permitir trafico para SAV"

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # API Gateway
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH para despliegue
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "public_ip" {
  value       = aws_instance.sav_backend.public_ip
  description = "Copia esta IP en el secreto AWS_EC2_IP de GitHub"
}