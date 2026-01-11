# 🆔 Identity Microservice

Este es el servicio principal (Gateway) del Sistema de Asistencia Inteligente (SAV).

## 🚀 Responsabilidades
- **Gestión de Usuarios:** Registro y autenticación (JWT).
- **Gestión Académica:** Clases, horarios y sesiones.
- **Generación de QR:** Crea tokens seguros y firmados para las sesiones de clase.
- **Registro de Asistencia:** Valida QRs y registra la presencia en PostgreSQL.
- **Orquestación:** Emite eventos a otros microservicios (Analytics, Notifications) vía TCP.

## 🛠️ Tecnologías
- NestJS (Monorepo)
- TypeORM + PostgreSQL
- JWT (JSON Web Tokens)
- TCP Client Proxy