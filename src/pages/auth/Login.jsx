import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password || !role) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (role === 'docente') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">QuizAI</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <div className="login-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>Rol</label>
          <div className="role-selector">
            <button
              className={`role-btn ${role === 'docente' ? 'active' : ''}`}
              onClick={() => setRole('docente')}
            >
              Docente
            </button>
            <button
              className={`role-btn ${role === 'estudiante' ? 'active' : ''}`}
              onClick={() => setRole('estudiante')}
            >
              Estudiante
            </button>
          </div>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-submit" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default Login;