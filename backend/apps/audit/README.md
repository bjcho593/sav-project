# 🛡️ Audit Microservice

The Audit Microservice is a dedicated security component designed to maintain an immutable record of all critical transactions within the SAV (Smart Attendance Verification) ecosystem.

## 🚀 Responsibilities
- **Immutable Event Logging:** Records every student attendance registration for legal and academic traceability.
- **Security Monitoring:** Provides a real-time stream of verified actions to detect anomalies.
- **Data Integrity:** Operates as a standalone service to ensure that audit trails remain intact even if other services face issues.

## 🛠️ Tech Stack
- **Framework:** NestJS
- **Communication:** TCP (Internal Mesh)
- **Port:** 3004
- **Event Pattern:** `attendance_registered`