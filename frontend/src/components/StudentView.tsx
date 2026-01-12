import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../api/axiosConfig';

export const StudentView = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  // ID de alumno SIMULADO (Este es el que se usa para la tesis por ahora)
  const studentId = '123e4567-e89b-12d3-a456-426614174999';

  useEffect(() => {
    // 1. Configuración del escáner
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 5, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    // 2. Función que se ejecuta cuando la cámara detecta un QR válido
    const onScanSuccess = async (decodedText: string) => {
      // Detenemos el escáner para no enviar la misma petición 20 veces
      scanner.clear();
      setScanResult(decodedText);
      setMessage('🔄 Procesando asistencia...');

      try {
        // 3. Enviamos el token leído al Backend
        console.log("📤 Enviando QR al backend:", decodedText);
        
        const response = await api.post('/register', {
          userId: studentId,
          qrContent: decodedText
        });

        // 4. ¡Éxito!
        setStatus('SUCCESS');
        setMessage(`✅ ${response.data.message}`);

      } catch (error: any) {
        // 5. Error (Token vencido, ya registrado, etc)
        setStatus('ERROR');
        console.error("❌ Error:", error);
        
        if (error.response) {
          setMessage(`❌ ${error.response.data.message}`);
        } else {
          setMessage('❌ Error de conexión con el servidor.');
        }
      }
    };

    const onScanFailure = (error: any) => {
      // Ignoramos errores de lectura frame por frame (es normal)
    };

    // Iniciamos el escáner
    scanner.render(onScanSuccess, onScanFailure);

    // Limpieza cuando el usuario sale de la pantalla
    return () => {
      scanner.clear().catch(error => console.error("Error al limpiar escáner", error));
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🤳 Soy Alumno</h1>
      <p>Apunta tu cámara al código del profesor</p>

      {/* AQUÍ es donde la librería dibuja la cámara */}
      {status === 'IDLE' && (
        <div id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
      )}

      {/* Mensajes de resultado */}
      {status !== 'IDLE' && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          borderRadius: '10px',
          backgroundColor: status === 'SUCCESS' ? '#d4edda' : '#f8d7da',
          color: status === 'SUCCESS' ? '#155724' : '#721c24'
        }}>
          <h3>{message}</h3>
          {status === 'SUCCESS' && <p>¡Tu asistencia ha sido enviada a Analytics!</p>}
          
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '15px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Escanear de nuevo
          </button>
        </div>
      )}
    </div>
  );
};