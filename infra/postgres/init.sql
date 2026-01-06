-- init.sql - Script de Inicialización de Base de Datos SAV

-- 1. CREACIÓN DE ESQUEMAS (Microservicios)
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS academic;
CREATE SCHEMA IF NOT EXISTS attendance;
CREATE SCHEMA IF NOT EXISTS analytics;

-- 2. TABLAS DEL MÓDULO DE IDENTIDAD
-- Usuarios: Login y Roles
CREATE TABLE identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Perfiles: Datos personales separados por seguridad
CREATE TABLE identity.profiles (
    user_id UUID PRIMARY KEY REFERENCES identity.users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    photo_url TEXT
);

-- 3. TABLAS DEL MÓDULO ACADÉMICO
-- Cursos: Las materias (Ej: Ingeniería de Software)
CREATE TABLE academic.courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, 
    credits INT
);

-- Horarios: Cuándo se dictan las clases
CREATE TABLE academic.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id INT REFERENCES academic.courses(id),
    teacher_id UUID REFERENCES identity.users(id),
    day_of_week VARCHAR(15), -- LUNES, MARTES...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    classroom VARCHAR(50)
);

-- Matrículas: Qué estudiante está en qué curso
CREATE TABLE academic.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES identity.users(id),
    course_id INT REFERENCES academic.courses(id),
    term VARCHAR(20), -- Ej: '2025-1'
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- 4. TABLAS DEL MÓDULO DE ASISTENCIA (CORE)
-- Sesiones: La clase real de un día específico
CREATE TABLE attendance.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES academic.schedules(id),
    actual_date DATE DEFAULT CURRENT_DATE,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, CLOSED, PAUSED
    current_token_seed VARCHAR(255) -- Semilla para el QR dinámico
);

-- Registros: La marca final del estudiante
CREATE TABLE attendance.records (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES attendance.sessions(id),
    student_id UUID REFERENCES identity.users(id),
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20), -- PRESENT, LATE
    gps_lat FLOAT,
    gps_long FLOAT,
    device_fingerprint VARCHAR(255),
    UNIQUE(session_id, student_id)
);

-- 5. DATOS SEMILLA (Para pruebas rápidas)
-- Password '123456' hasheada (simulada)
INSERT INTO identity.users (email, password_hash, role) VALUES 
('admin@sav.edu.ec', '$2b$10$EpI...', 'ADMIN'),
('teacher@sav.edu.ec', '$2b$10$EpI...', 'TEACHER'),
('student@sav.edu.ec', '$2b$10$EpI...', 'STUDENT');