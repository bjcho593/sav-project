import { useEffect, useState } from 'react';
import axios from 'axios';

// 👇 PEGA AQUÍ EL ID DEL PROFESOR QUE USASTE EN LA BASE DE DATOS
const TEACHER_ID = 'ab33bf2b-e08d-40fe-b89a-9e5435ff8ba6'; 

function App() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [attendees, setAttendees] = useState<any[]>([]);

  // 1. Cargar las clases del profesor al iniciar
  useEffect(() => {
    axios.get(`http://localhost:3000/academic/teacher/${TEACHER_ID}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error cargando clases:", err));
  }, []);

  // 2. Generar QR y obtener ID de Sesión (Se ejecuta al seleccionar clase)
  useEffect(() => {
    if (!selectedClass) return;

    // Reseteamos estados al cambiar de clase
    setAttendees([]); 
    setSessionId('');
    setQrCode('');

    const fetchQr = () => {
      axios.get(`http://localhost:3000/qr?classId=${selectedClass.id}`)
        .then((res) => {
          // Ahora el backend nos devuelve un objeto: { qrImage, sessionId }
          setQrCode(res.data.qrImage);
          setSessionId(res.data.sessionId); 
        })
        .catch(err => console.error("Error generando QR:", err));
    };

    fetchQr(); // Primera carga
    const interval = setInterval(fetchQr, 10000); // Refrescar QR cada 10s (seguridad)

    return () => clearInterval(interval);
  }, [selectedClass]);

  // 3. Polling: Consultar la lista de asistentes cada 2 segundos
  useEffect(() => {
    if (!sessionId) return; // No hacer nada si no hay sesión iniciada

    const fetchAttendees = () => {
      axios.get(`http://localhost:3000/session/${sessionId}/attendees`)
        .then((res) => {
          setAttendees(res.data); // Actualizamos la lista
        })
        .catch(err => console.error("Error cargando lista:", err));
    };

    fetchAttendees(); // Carga inmediata
    const interval = setInterval(fetchAttendees, 2000); // Repetir cada 2s

    return () => clearInterval(interval);
  }, [sessionId]); // Se activa cuando tenemos un sessionId

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '20px', backgroundColor: '#2c3e50', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🎓 Panel Docente SAV</h1>
      </header>

      <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', backgroundColor: '#f4f6f9' }}>
        
        {/* COLUMNA 1: LISTA DE CLASES */}
        <div style={{ width: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#7f8c8d' }}>📅 Mis Clases</h3>
          {classes.map((cls) => (
            <div 
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedClass?.id === cls.id ? '2px solid #3498db' : '1px solid #eee',
                backgroundColor: selectedClass?.id === cls.id ? '#ebf5fb' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <strong style={{ display: 'block', fontSize: '1.1em' }}>{cls.course.name}</strong>
              <span style={{ color: '#666', fontSize: '0.9em' }}>🕒 {cls.startTime} - {cls.endTime}</span>
            </div>
          ))}
        </div>

        {/* COLUMNA 2: EL QR GIGANTE */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {selectedClass ? (
            <>
              <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>{selectedClass.course.name}</h2>
              <div style={{ border: '15px solid #2c3e50', borderRadius: '20px', padding: '10px', display: 'inline-block', backgroundColor: 'white' }}>
                 {qrCode ? <img src={qrCode} alt="QR" style={{ width: '350px', height: '350px' }} /> : <p>Cargando...</p>}
              </div>
              <p style={{ marginTop: '20px', color: '#7f8c8d' }}>
                Escanea este código desde la App Móvil <br/>
                <small>Sesión ID: {sessionId.split('-')[0]}...</small>
              </p>
            </>
          ) : (
            <p style={{ color: '#bdc3c7', fontSize: '1.5em' }}>⬅ Selecciona una clase para comenzar</p>
          )}
        </div>

        {/* COLUMNA 3: LISTA EN VIVO */}
        <div style={{ width: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#27ae60' }}>👥 Asistentes ({attendees.length})</h3>
          
          <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {attendees.length === 0 ? (
              <p style={{ color: '#bdc3c7', textAlign: 'center', marginTop: '20px' }}>Esperando alumnos...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {attendees.map((record) => (
                  <li key={record.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {/* Mostramos el nombre real del alumno */}
                      <strong>{record.student ? record.student.fullName : 'Estudiante'}</strong>
                      <br/>
                      <small style={{ color: '#95a5a6' }}>{record.student ? record.student.email : '...'}</small>
                    </div>
                    <span style={{ fontSize: '0.8em', backgroundColor: '#dff9fb', padding: '2px 8px', borderRadius: '10px', color: '#130f40' }}>
                      {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;