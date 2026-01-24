# 🚀 SAV - Smart Attendance Verification System

A professional university attendance management ecosystem built on an **Event-Driven Microservices Architecture**.

## 🏗️ System Architecture
The system consists of 8 microservices communicating via **TCP** to ensure low latency and high availability:

| Service | Port | Primary Function |
| :--- | :--- | :--- |
| **Identity** | 3000 | API Gateway, JWT Auth & Orchestrator |
| **Session Manager** | 3005 | QR Lifecycle & Time-to-Live Validation |
| **Scheduling** | 3007 | Academic Calendar & Time-Slot Validation |
| **Enrollment** | 3006 | Student Matriculation & Course List Validation |
| **Analytics** | 3001 | Real-time Metric Processing & Statistics |
| **Audit** | 3004 | Integrity Tracing & Security Hashing (SHA-256) |
| **Notifications** | 3002 | Asynchronous Confirmations (Email/Push) |
| **Reports** | 3003 | PDF Certificate & Document Generation |

## 🛠️ Tech Stack
- **Framework:** NestJS (Node.js v20+)
- **Database:** PostgreSQL + TypeORM
- **DevOps:** Docker & Docker Compose
- **Cloud:** AWS (VPC, ECS, RDS) via Terraform
- **Communication:** TCP (Service Mesh)

## 🚀 Quick Start (Local Deployment)
To spin up the entire ecosystem including the database:

```bash
cd backend
docker-compose up --build