import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizDashboard.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const datosDemo = {
  1: {
    titulo: 'Quiz de Historia',
    estudiantesRespondieron: 25,
    promedioAciertos: 72,
    tiempoPromedio: '12 min',
    preguntas: [
      {
        id: 1,
        texto: '¿En qué año comenzó la Segunda Guerra Mundial?',
        opciones: [
          { texto: '1935', respuestas: 2 },
          { texto: '1939', respuestas: 18 },
          { texto: '1941', respuestas: 4 },
          { texto: '1945', respuestas: 1 },
        ],
        correcta: 1,
        tiempoPromedio: '45 seg',
      },
      {
        id: 2,
        texto: '¿Quién fue el líder de Alemania Nazi?',
        opciones: [
          { texto: 'Mussolini', respuestas: 3 },
          { texto: 'Hitler', respuestas: 20 },
          { texto: 'Franco', respuestas: 1 },
          { texto: 'Stalin', respuestas: 1 },
        ],
        correcta: 1,
        tiempoPromedio: '30 seg',
      },
      {
        id: 3,
        texto: '¿Qué tratado firmó Alemania al final de la guerra?',
        opciones: [
          { texto: 'Versailles', respuestas: 8 },
          { texto: 'París', respuestas: 5 },
          { texto: 'Potsdam', respuestas: 10 },
          { texto: 'Bretton Woods', respuestas: 2 },
        ],
        correcta: 2,
        tiempoPromedio: '90 seg',
      },
    ],
  },
  2: {
    titulo: 'Quiz de Matemáticas',
    estudiantesRespondieron: 18,
    promedioAciertos: 65,
    tiempoPromedio: '15 min',
    preguntas: [
      {
        id: 1,
        texto: '¿Cuánto es 5 + 3 × 2?',
        opciones: [
          { texto: '16', respuestas: 4 },
          { texto: '11', respuestas: 12 },
          { texto: '13', respuestas: 1 },
          { texto: '20', respuestas: 1 },
        ],
        correcta: 1,
        tiempoPromedio: '25 seg',
      },
      {
        id: 2,
        texto: 'Resuelve: 2x + 5 = 15',
        opciones: [
          { texto: 'x = 10', respuestas: 2 },
          { texto: 'x = 5', respuestas: 14 },
          { texto: 'x = 7', respuestas: 1 },
          { texto: 'x = 4', respuestas: 1 },
        ],
        correcta: 1,
        tiempoPromedio: '60 seg',
      },
    ],
  },
  3: {
    titulo: 'Quiz de Biología',
    estudiantesRespondieron: 30,
    promedioAciertos: 58,
    tiempoPromedio: '18 min',
    preguntas: [
      {
        id: 1,
        texto: '¿Cuál es la unidad básica de la vida?',
        opciones: [
          { texto: 'Átomo', respuestas: 1 },
          { texto: 'Molécula', respuestas: 3 },
          { texto: 'Célula', respuestas: 24 },
          { texto: 'Tejido', respuestas: 2 },
        ],
        correcta: 2,
        tiempoPromedio: '20 seg',
      },
      {
        id: 2,
        texto: '¿Qué organelo produce energía?',
        opciones: [
          { texto: 'Núcleo', respuestas: 4 },
          { texto: 'Mitocondria', respuestas: 22 },
          { texto: 'Ribosoma', respuestas: 2 },
          { texto: 'Lisosoma', respuestas: 2 },
        ],
        correcta: 1,
        tiempoPromedio: '35 seg',
      },
      {
        id: 3,
        texto: '¿Cómo se llama la división celular normal?',
        opciones: [
          { texto: 'Mitosis', respuestas: 18 },
          { texto: 'Meiosis', respuestas: 8 },
          { texto: 'Fisión', respuestas: 3 },
          { texto: 'Citocinesis', respuestas: 1 },
        ],
        correcta: 0,
        tiempoPromedio: '55 seg',
      },
    ],
  },
};

function DonutChart({ opciones, correcta }) {
  const total = opciones.reduce((acc, op) => acc + op.respuestas, 0);
  if (total === 0) return <div className="donut-empty">Sin datos</div>;

  const colors = ['#7c6af7', '#4ecdc4', '#ff6b6b', '#ffd93d'];
  let cumulative = 0;
  const segments = opciones.map((op, idx) => {
    const percentage = (op.respuestas / total) * 100;
    const start = cumulative;
    cumulative += percentage;
    return {
      percentage,
      start,
      color: idx === correcta ? '#4ade80' : colors[idx % colors.length],
      isCorrect: idx === correcta,
    };
  });

  return (
    <div className="donut-container">
      <svg viewBox="0 0 100 100" className="donut-chart">
        {segments.map((seg, idx) => {
          if (seg.percentage === 0) return null;
          const radius = 40;
          const circumference = 2 * Math.PI * radius;
          const strokeDasharray = (seg.percentage / 100) * circumference;
          const strokeDashoffset = -(seg.start / 100) * circumference;
          return (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          );
        })}
      </svg>
      <div className="donut-center">
        <span className="donut-total">{total}</span>
        <span className="donut-label">resp.</span>
      </div>
    </div>
  );
}

function QuestionCard({ pregunta, numero }) {
  const total = pregunta.opciones.reduce((acc, op) => acc + op.respuestas, 0);
  const correctas = pregunta.opciones[pregunta.correcta]?.respuestas || 0;
  const porcentajeAciertos = total > 0 ? Math.round((correctas / total) * 100) : 0;

  const getDifficultyClass = () => {
    if (porcentajeAciertos >= 70) return 'facil';
    if (porcentajeAciertos >= 40) return 'medio';
    return 'dificil';
  };

  const getDifficultyText = () => {
    if (porcentajeAciertos >= 70) return 'Fácil';
    if (porcentajeAciertos >= 40) return 'Medio';
    return 'Difícil';
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Pregunta {numero}</span>
        <span className={`difficulty-badge ${getDifficultyClass()}`}>
          {getDifficultyText()}
        </span>
      </div>
      <p className="question-text">{pregunta.texto}</p>

      <div className="question-content">
        <div className="chart-section">
          <DonutChart opciones={pregunta.opciones} correcta={pregunta.correcta} />
          <div className="chart-legend">
            {pregunta.opciones.map((op, idx) => (
              <div key={idx} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: idx === pregunta.correcta ? '#4ade80' : ['#7c6af7', '#4ecdc4', '#ff6b6b', '#ffd93d'][idx % 4] }}
                />
                <span className="legend-text">{op.texto}</span>
                <span className="legend-count">{op.respuestas}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-label">Aciertos</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${porcentajeAciertos}%` }}
              />
            </div>
            <span className="stat-value">{porcentajeAciertos}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tiempo promedio</span>
            <span className="stat-time">{pregunta.tiempoPromedio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const quizId = parseInt(location.pathname.split('/')[3]) || 1;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuizData(datosDemo[quizId] || datosDemo[1]);
      setLoading(false);
    }, 600);
  }, [quizId]);

  const cerrarSidebar = () => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <p>No se encontró el quiz</p>
          <button onClick={() => navigate('/teacher/dashboard')}>
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" onClick={cerrarSidebar}>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <span>QuizAI</span>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className="sidebar-btn"
            onClick={() => navigate('/teacher/dashboard')}
          >
            ← Volver
          </button>
        </nav>
      </aside>

      {/* Botón flotante cuando sidebar está colapsada */}
      {sidebarCollapsed && (
        <button
          className="sidebar-collapsed-toggle"
          onClick={() => setSidebarCollapsed(false)}
        >
          ☰
        </button>
      )}

      <main className="main-content">
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">{quizData.titulo}</h1>
            <p className="dashboard-subtitle">Analytics del quiz</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card-value">{quizData.estudiantesRespondieron}</span>
              <span className="stat-card-label">Estudiantes</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{quizData.promedioAciertos}%</span>
              <span className="stat-card-label">Aciertos promedio</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{quizData.tiempoPromedio}</span>
              <span className="stat-card-label">Tiempo promedio</span>
            </div>
          </div>

          <div className="questions-section">
            <h2 className="section-title">Análisis por pregunta</h2>
            {quizData.preguntas.length === 0 ? (
              <div className="empty-state">
                <p>No hay preguntas en este quiz</p>
              </div>
            ) : (
              <div className="questions-list">
                {quizData.preguntas.map((pregunta, idx) => (
                  <QuestionCard
                    key={pregunta.id}
                    pregunta={pregunta}
                    numero={idx + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizDashboard;