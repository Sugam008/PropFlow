# PropFlow Infrastructure - AWS

# Provider Configuration
terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "propflow-terraform-state"
    key            = "propflow/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "propflow-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "PropFlow"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name"
  default     = "staging"
}

variable "db_password" {
  description = "Database password"
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  sensitive   = true
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "propflow-vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Name = "propflow-vpc"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "propflow_db" {
  identifier     = "propflow-db-${var.environment}"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.small"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true

  db_name  = "propflow"
  username = "propflow"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.propflow.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "propflow-final-snapshot"

  performance_insights_enabled = true
}

resource "aws_db_subnet_group" "propflow" {
  name       = "propflow-db-subnet"
  subnet_ids = module.vpc.private_subnets
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "propflow_redis" {
  cluster_id           = "propflow-redis-${var.environment}"
  engine               = "redis"
  node_type            = "cache.t3.small"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  
  security_group_ids = [aws_security_group.redis.id]
  subnet_group_name  = aws_elasticache_subnet_group.propflow.name
}

resource "aws_elasticache_subnet_group" "propflow" {
  name       = "propflow-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

# S3 Bucket for Photos
resource "aws_s3_bucket" "photos" {
  bucket = "propflow-photos-${var.environment}"
}

resource "aws_s3_bucket_versioning" "photos" {
  bucket = aws_s3_bucket.photos.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "photos" {
  bucket = aws_s3_bucket.photos.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Security Groups
resource "aws_security_group" "db" {
  name        = "propflow-db-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}

resource "aws_security_group" "redis" {
  name        = "propflow-redis-sg"
  description = "Security group for Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}

resource "aws_security_group" "app" {
  name        = "propflow-app-sg"
  description = "Security group for application"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "propflow" {
  name = "propflow-cluster-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECR Repositories
resource "aws_ecr_repository" "backend" {
  name                 = "propflow-backend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "dashboard" {
  name                 = "propflow-dashboard"
  image_tag_mutability = "MUTABLE"
}

# Application Load Balancer
resource "aws_lb" "propflow" {
  name               = "propflow-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app.id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "api" {
  name     = "propflow-api-tg"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    path = "/health"
  }
}

resource "aws_lb_target_group" "dashboard" {
  name     = "propflow-dashboard-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    path = "/api/health"
  }
}

# Outputs
output "db_endpoint" {
  value = aws_db_instance.propflow_db.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.propflow_redis.cache_nodes[0].address
}

output "s3_bucket" {
  value = aws_s3_bucket.photos.bucket
}

output "alb_dns_name" {
  value = aws_lb.propflow.dns_name
}
