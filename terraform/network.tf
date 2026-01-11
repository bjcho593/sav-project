# 1. La Red Principal (VPC)
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "sav-vpc-${var.environment}" }
}

# 2. Subred PÚBLICA (Bastion + Load Balancer)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags = { Name = "sav-public-subnet-${var.environment}" }
}

# 3. Subred PRIVADA (Apps + Base de Datos)
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags = { Name = "sav-private-subnet-a-${var.environment}" }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1b" # RDS necesita al menos 2 zonas
  tags = { Name = "sav-private-subnet-b-${var.environment}" }
}

# 4. Puerta a Internet (Internet Gateway)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# 5. Enrutamiento
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# NAT Gateway (Para que la red privada tenga internet de salida para descargar Docker/Git)
# NOTA: En AWS Academy esto consume mucho presupuesto. 
# Si falla por permisos/costos, avísame para darte una alternativa "barata".
resource "aws_eip" "nat_eip" { vpc = true }

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public.id
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

resource "aws_route_table_association" "private_assoc_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private_rt.id
}