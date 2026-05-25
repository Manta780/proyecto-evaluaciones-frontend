import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../../services/firebase';
import { registerAPI } from '../../services/api';
import './Register.css';

console.log('Firebase App inicializada:', app.name);

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const auth = getAuth();

      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;
      const firebaseToken = await userCredential.user.getIdToken();

      console.log('✓ Usuario creado en Firebase:', firebaseUid);

      // Registrar en PostgreSQL (mismo formato que tu código)
      const registerResponse = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: name,
          role: role,
          firebase_uid: firebaseUid
        })
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.error('✗ Error del backend:', errorData);
        throw new Error(errorData.detail || 'Error al registrar en PostgreSQL');
      }

      const profile = await registerResponse.json();
      console.log('✓ Usuario registrado en PostgreSQL:', profile);

      // Guardar token y perfil
      localStorage.setItem('firebaseToken', firebaseToken);
      localStorage.setItem('userProfile', JSON.stringify(profile));

      console.log('✓ Sesión iniciada correctamente');
      console.log('📋 Perfil del usuario:', profile);

      // Redireccionar según el rol
      if (role === 'Docente') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('✗ Error en registro:', err.message);
      setError(err.response?.data?.detail || err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Crear Cuenta</h1>
        <p className="register-subtitle">Regístrate en QuizAI</p>

        <div className="register-field">
          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="register-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="register-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="register-field">
          <label>Rol</label>
          <div className="role-selector">
            <button
              className={`role-btn ${role === 'Docente' ? 'active' : ''}`}
              onClick={() => setRole('Docente')}
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

        {error && <p className="register-error">{error}</p>}

        <button
          className="register-submit"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="register-login">
          ¿Ya tienes cuenta?{' '}
          <span onClick={() => navigate('/login')}>Iniciar sesión</span>
        </p>
      </div>
    </div>
  );
}

export default Register;