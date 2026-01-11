# 🎓 SAV - Smart Attendance Verification

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Environment](https://img.shields.io/badge/environment-QA-orange)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple)

**SAV** is a thesis project designed to automate academic attendance tracking using secure, dynamic QR codes. The system prevents fraud through cryptographic token generation and provides real-time analytics for teachers.

## 🚀 Technology Stack

* **Backend:** NestJS (Node.js), TypeORM, JWT Authentication.
* **Frontend:** React, TypeScript, Vite.
* **Database:** PostgreSQL (AWS RDS).
* **Infrastructure:** Terraform (IaC), AWS (EC2, ALB, VPC), Docker.

## 🛠️ Installation & Local Deployment

### Prerequisites
* Docker & Docker Compose
* Node.js v18+

### Quick Start
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bjcho593/sav-project.git](https://github.com/bjcho593/sav-project-thesis.git)
    ```

2.  **Start Database and Backend:**
    ```bash
    docker-compose up -d
    ```

3.  **Run Frontend:**
    ```bash
    cd web-portal
    npm install
    npm run dev
    ```

## 📖 API Documentation
Once the backend is running, full Swagger documentation is available at:
`http://localhost:3000/api/docs`

## ☁️ Cloud Infrastructure (AWS)
This project uses **Terraform** for Infrastructure as Code (IaC). The architecture ensures High Availability (HA) and security best practices.

* **Bastion Host:** Secure entry point (JumpBox).
* **VPC:** Public/Private subnet segregation.
* **RDS:** Managed PostgreSQL with automated backups.
* **ALB:** Application Load Balancer with Auto Scaling Groups.

Check the `/terraform` directory for configuration files.

## 🤝 Contribution & Workflow
We follow **Conventional Commits** and strict Branch Protection rules:
* `qa`: Staging branch for integration testing.
* `main`: Production branch (Requires Pull Request approval).

---
*Project 2026*