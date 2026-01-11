# --- 1. JUMPBOX / BASTION HOST ---
resource "aws_instance" "bastion" {
  ami           = "ami-053b0d53c279acc90" # Ubuntu 22.04
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
  key_name      = "sav-deploy-key" # Asegúrate de haber subido la key
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]

  tags = { Name = "SAV-Bastion-${var.environment}" }
}

# REQUISITO: IP Elástica para el Bastion
resource "aws_eip" "bastion_eip" {
  instance = aws_instance.bastion.id
  vpc      = true
}

# --- 2. LOAD BALANCER ---
resource "aws_lb" "app_lb" {
  name               = "sav-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = [aws_subnet.public.id, aws_subnet.private_b.id] # ALB necesita 2 zonas
}

resource "aws_lb_target_group" "sav_tg" {
  name     = "sav-tg-${var.environment}"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  health_check {
    path = "/" # Endpoint de salud
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sav_tg.arn
  }
}

# --- 3. AUTO SCALING GROUP (APP SERVERS) ---
resource "aws_launch_template" "sav_lt" {
  name_prefix   = "sav-lt-${var.environment}"
  image_id      = "ami-053b0d53c279acc90"
  instance_type = "t2.micro"
  
  network_interfaces {
    associate_public_ip_address = false # Están en red privada
    security_groups             = [aws_security_group.app_sg.id]
  }

  # Script de inicio (User Data)
  user_data = base64encode(<<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io docker-compose git
              # Clonar repo y levantar docker
              cd /home/ubuntu
              git clone https://github.com/TU_USUARIO/sav-project-thesis.git
              cd sav-project-thesis
              git checkout ${var.environment}
              # Conectar a RDS
              echo "DB_HOST=${aws_db_instance.postgres.address}" >> .env
              echo "DB_PASS=${var.db_password}" >> .env
              sudo docker-compose up -d --build
              EOF
  )
}

resource "aws_autoscaling_group" "sav_asg" {
  desired_capacity    = 2
  max_size            = 3
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  target_group_arns   = [aws_lb_target_group.sav_tg.arn]

  launch_template {
    id      = aws_launch_template.sav_lt.id
    version = "$Latest"
  }
}