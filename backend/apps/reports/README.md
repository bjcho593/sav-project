# 📄 Reports Microservice

This microservice is part of the SAV (Smart Attendance Verification) ecosystem, specialized in document generation and data aggregation.

## 🚀 Responsibilities
- **PDF Generation:** Automatically creates attendance certificates when a student registers.
- **Asynchronous Workload:** Offloads CPU-intensive tasks (document rendering) from the main Identity service.
- **Reporting Engine:** Prepares daily and weekly attendance summaries for academic analysis.

## 🛠️ Technical Details
- **Framework:** NestJS
- **Communication:** TCP (Internal Microservice Mesh)
- **Port:** 3003
- **Event Pattern:** `attendance_registered`

## 📡 Usage
The service listens for attendance events and triggers the internal PDF engine to store a verifiable record of the student's presence.