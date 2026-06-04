import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/api';
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
  // Usar datos del backend si están disponibles, sino calcular
  const porcentajeAciertos = pregunta.tasaAcierto ?? (total > 0 ? Math.round((correctas / total) * 100) : 0);

  const getDifficultyClass = () => {
    if (pregunta.dificultad) {
      if (pregunta.dificultad === 'Fácil') return 'facil';
      if (pregunta.dificultad === 'Medio') return 'medio';
      return 'dificil';
    }
    if (porcentajeAciertos >= 70) return 'facil';
    if (porcentajeAciertos >= 40) return 'medio';
    return 'dificil';
  };

  const getDifficultyText = () => {
    return pregunta.dificultad || (porcentajeAciertos >= 70 ? 'Fácil' : porcentajeAciertos >= 40 ? 'Medio' : 'Difícil');
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
  const [studentsData, setStudentsData] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [vistaActual, setVistaActual] = useState('preguntas'); // 'preguntas' o 'estudiantes'

  const quizId = parseInt(location.pathname.split('/')[3]) || 1;

  useEffect(() => {
    const fetchQuizResults = async () => {
      setLoading(true);
      console.log('🔍 Obteniendo resultados para quiz ID:', quizId);
      console.log('🔍 URL completa:', `https://proyecto-evaluaciones.vercel.app/quiz/${quizId}/results`);

      try {
        const response = await quizAPI.getQuizResults(quizId);
        const data = response.data;

        console.log('📥 Resultados del quiz:', data);

        // Mapear datos del backend al formato del componente
        const preguntasMapeadas = (data.preguntas || []).map((preg) => ({
          id: parseInt(preg.question_id),
          texto: preg.statement,
          opciones: (preg.distribucion_opciones || []).map((op) => ({
            texto: op.opcion,
            respuestas: op.cantidad,
          })),
          correcta: preg.distribucion_opciones?.findIndex(op => op.es_correcta) || 0,
          tiempoPromedio: `${preg.tiempo_promedio_segundos || 0} seg`,
          tasaAcierto: preg.tasa_acierto,
          dificultad: preg.dificultad,
        }));

        // Calcular promedio de aciertos
        const promedioAciertos = preguntasMapeadas.length > 0
          ? Math.round(preguntasMapeadas.reduce((acc, p) => acc + (p.tasaAcierto || 0), 0) / preguntasMapeadas.length)
          : 0;

        setQuizData({
          titulo: quizTitle || `Quiz #${quizId}`,
          estudiantesRespondieron: data.total_estudiantes || 0,
          promedioAciertos: promedioAciertos,
          tiempoPromedio: '-- min',
          preguntas: preguntasMapeadas,
        });
      } catch (err) {
        console.error('❌ Error al obtener resultados:', err);
        console.error('Response:', err.response?.data);
        console.error('Status:', err.response?.status);

        // En caso de error, mostrar mensaje
        setQuizData({
          titulo: quizTitle || `Quiz #${quizId}`,
          estudiantesRespondieron: 0,
          promedioAciertos: 0,
          tiempoPromedio: '-- min',
          preguntas: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();

    // Cargar datos de estudiantes
    const fetchStudentsScores = async () => {
      try {
        const response = await quizAPI.getStudentsScores(quizId);
        const data = response.data;
        console.log('📥 Datos de estudiantes:', data);
        setStudentsData(data);
        // Guardar el título del quiz
        if (data.quiz_title) {
          setQuizTitle(data.quiz_title);
          // Actualizar el título también en quizData si ya está cargado
          setQuizData(prev => prev ? { ...prev, titulo: data.quiz_title } : null);
        }
      } catch (err) {
        console.error('Error al obtener estudiantes:', err);
      }
    };

    fetchStudentsScores();
  }, [quizId, quizTitle]);

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
            className={`sidebar-btn ${vistaActual === 'preguntas' ? 'active' : ''}`}
            onClick={() => setVistaActual('preguntas')}
          >
            📊 Resultados
          </button>
          <button
            className={`sidebar-btn ${vistaActual === 'estudiantes' ? 'active' : ''}`}
            onClick={() => setVistaActual('estudiantes')}
          >
            👥 Estudiantes
          </button>
          <button
            className="sidebar-btn"
            onClick={() => navigate('/teacher/dashboard')}
            style={{ marginTop: 'auto' }}
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

          {/* Vista: Resultados por pregunta */}
          {vistaActual === 'preguntas' && (
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
          )}
          {vistaActual === 'preguntas' && (
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
          )}

          {/* Vista: Lista de estudiantes */}
          {vistaActual === 'estudiantes' && (
            <div className="students-section">
              <h2 className="section-title">Lista de estudiantes</h2>

              {studentsData?.estudiantes?.length === 0 ? (
                <div className="empty-state">
                  <p>No hay estudiantes que hayan realizado este quiz</p>
                </div>
              ) : (
                <>
                  {/* Stats de estudiantes */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-card-value">{studentsData?.total_estudiantes || 0}</span>
                      <span className="stat-card-label">Total estudiantes</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-card-value">{studentsData?.promedio_grupo || 0}%</span>
                      <span className="stat-card-label">Promedio grupo</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-card-value">{studentsData?.aprobados || 0}</span>
                      <span className="stat-card-label">Aprobados</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-card-value">{studentsData?.reprobados || 0}</span>
                      <span className="stat-card-label">Reprobados</span>
                    </div>
                  </div>

                  {/* Tabla de estudiantes */}
                  <div className="students-table-container">
                    <table className="students-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Estudiante</th>
                          <th>Nota</th>
                          <th>Estado</th>
                          <th>Correctas</th>
                          <th>Incorrectas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsData?.estudiantes?.map((estudiante, idx) => (
                          <tr key={estudiante.attempt_id}>
                            <td>{idx + 1}</td>
                            <td>{estudiante.student_name}</td>
                            <td className="score-cell">{estudiante.total_score}%</td>
                            <td>
                              <span className={`status-badge ${estudiante.aprobado ? 'aprobado' : 'reprobado'}`}>
                                {estudiante.aprobado ? '✓ Aprobado' : '✗ Reprobado'}
                              </span>
                            </td>
                            <td>{estudiante.respuestas_correctas}</td>
                            <td>{estudiante.respuestas_incorrectas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuizDashboard;