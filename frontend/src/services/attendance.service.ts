import axios from 'axios';

// La URL apunta al Gateway de Identity que orquesta las 4 validaciones
const API_URL = 'http://localhost:3000';

export const registerAttendance = async (userId: string, qrContent: string) => {
  try {
    const response = await axios.post(`${API_URL}/identity/register-attendance`, {
      userId,
      qrContent,
    });
    
    // Si llegamos aquí, pasó las validaciones de Session, Enrollment y Scheduling
    return response.data; 
  } catch (error: any) {
    // Extraemos el mensaje de error específico (ej: "Fuera de horario" o "No matriculado")
    const errorMessage = error.response?.data?.message || 'Connection error with the Security Gateway';
    throw new Error(errorMessage);
  }
};