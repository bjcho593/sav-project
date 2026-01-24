import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export const TeacherView = () => {
  const [qrImage, setQrImage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const generateQr = async () => {
      try {
        // ID de horario fijo para pruebas
        const classId = '550e8400-e29b-41d4-a716-446655440000';
        
        const response = await api.get(`/qr?classId=${classId}`);
        
        setQrImage(response.data.qrImage);
        setSessionId(response.data.sessionId);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error al obtener el QR:", error);
        setLoading(false);
      }
    };

    generateQr();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>👨‍🏫 Panel del Profesor</h1>
      <p>Proyecta este código para registrar asistencia.</p>

      {loading ? (
        <p>⏳ Generando código seguro...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {qrImage && (
            <div style={{ 
              border: '5px solid #333', 
              padding: '10px', 
              display: 'inline-block',
              borderRadius: '10px'
            }}>
              <img src={qrImage} alt="QR de Asistencia" width={300} />
            </div>
          )}
          
          <div style={{ marginTop: '20px', color: '#666' }}>
            <small>ID de Sesión Activa: {sessionId}</small>
          </div>
        </div>
      )}
    </div>
  );
};