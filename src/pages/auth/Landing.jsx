import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">QuizAI</div>
        <div className="landing-auth-buttons">
          <button
            className="landing-btn-outline"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>
          <button
            className="landing-btn-primary"
            onClick={() => navigate('/register')}
          >
            Registrarse
          </button>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <h1 className="landing-title">
            Crea y resuelve evaluaciones<br />
            <span className="landing-title-accent">de forma inteligente</span>
          </h1>
          <p className="landing-description">
            QuizAI es una plataforma moderna para docentes y estudiantes.
            Crea cuestionarios personalizados,tracks el progreso de tus alumnos
            y aprende de manera interactiva con tecnología de inteligencia artificial.
          </p>
          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">📝</div>
              <h3>Crea Evaluaciones</h3>
              <p>Diseña cuestionarios adaptados a tus necesidades</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">🎓</div>
              <h3>Para Docentes</h3>
              <p>Gestiona tus cursos y evalúa fácilmente</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📊</div>
              <h3>Para Estudiantes</h3>
              <p>Aprende y tracks tu progreso académico</p>
            </div>
          </div>
          <div className="landing-cta">
            <button
              className="landing-btn-large"
              onClick={() => navigate('/login')}
            >
              Comenzar Ahora
            </button>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>© 2026 QuizAI. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Landing;