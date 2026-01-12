# 🔔 Notifications Microservice

The Notifications Microservice manages all outgoing communications within the Smart Attendance Verification (SAV) system. It is designed to decouple communication logic from the core identity services, ensuring scalability and reliability.

## 🚀 Responsibilities

* **Event Listening:** Subscribes to the `attendance_registered` event emitted by the Identity Service via TCP.
* **Email Simulation:** Processes requests to notify students upon successful class registration.
* **Scalability:** Built to easily integrate with third-party providers like SendGrid, AWS SES, or Firebase Cloud Messaging in the future.

## 🛠️ Tech Stack

* **Framework:** NestJS (Monorepo Architecture)
* **Transport Layer:** TCP (Microservice)
* **Port:** 3002
* **Dependencies:** `@nestjs/microservices`, `@nestjs/common`

## 📡 Event Pattern

This service listens for the following event pattern:

* **Event:** `attendance_registered`
* **Payload:**
    ```json
    {
      "studentId": "uuid",
      "sessionId": "uuid",
      "timestamp": "ISO Date"
    }
    ```

## ▶️ Running the Service

To start the service in development mode:

```bash
# From the root backend folder
npm run start:dev notifications