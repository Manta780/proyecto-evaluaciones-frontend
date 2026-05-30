import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../services/firebase';
import './Login.css';

console.log('Firebase App inicializada:', app.name);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password || !role) {
      setError('Por favor completa todos los campos: correo, contraseña y selecciona tu rol.');
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El correo no tiene un formato válido. Ejemplo: correo@ejemplo.com');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const auth = getAuth();

      // Iniciar sesión en Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;
      const firebaseToken = await userCredential.user.getIdToken();

      console.log('✓ Usuario logueado en Firebase:', firebaseUid);

      // Obtener perfil desde PostgreSQL usando el endpoint del usuario
      const profileResponse = await fetch(`http://127.0.0.1:8000/register/firebase/${firebaseUid}`);

      if (!profileResponse.ok) {
        // Verificar si es error 404 (no existe) u otro error
        if (profileResponse.status === 404) {
          setError('Esta cuenta no está registrada. Por favor, regístrate primero.');
          setLoading(false);
          return;
        }
        // Otro error del servidor
        setError('Error del servidor. Intenta de nuevo más tarde.');
        setLoading(false);
        return;
      }

      const profile = await profileResponse.json();
      console.log('✓ Perfil obtenido de PostgreSQL:', profile);

      // Guardar token y perfil
      localStorage.setItem('firebaseToken', firebaseToken);
      localStorage.setItem('userProfile', JSON.stringify(profile));

      console.log('✓ Sesión iniciada correctamente');
      console.log('📋 Perfil del usuario:', profile);

      // Verificar que el rol coincida
      if (profile.role !== role) {
        console.warn('⚠ El rol del usuario no coincide con la selección');
      }

      // Redireccionar según el rol
      if (role === 'Docente') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('✗ Error en login:', err.message);
      if (err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo. ¿Quieres registrarte?');
      } else if (err.code === 'auth/wrong-password') {
        setError('La contraseña es incorrecta. Intenta de nuevo.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del correo no es válido. Ingresa un correo válido.');
      } else if (err.code === 'auth/user-disabled') {
        setError('Esta cuenta ha sido deshabilitada. Contacta al administrador.');
      } else {
        setError(err.message || 'Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
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

        {error && <p className="login-error">{error}</p>}

        <button
          className="login-submit"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="login-register">
          ¿No tienes cuenta?{' '}
          <span onClick={() => navigate('/register')}>Regístrate</span>
        </p>
      </div>
    </div>
  );
}

export default Login;