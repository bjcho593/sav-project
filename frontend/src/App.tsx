import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Importamos tus componentes de prueba
import { TeacherView } from './components/TeacherView';
import { StudentView } from './components/StudentView';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
    <h1>🧪 Test de Tesis</h1>
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
      <Link to="/teacher">
        <button style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', background: '#007bff', color: 'white' }}>
          👨‍🏫 Probar Generar QR
        </button>
      </Link>
      <Link to="/student">
        <button style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', background: '#28a745', color: 'white' }}>
          🤳 Probar Escáner
        </button>
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Aquí conectamos las pantallas que creamos */}
        <Route path="/teacher" element={<TeacherView />} />
        <Route path="/student" element={<StudentView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;