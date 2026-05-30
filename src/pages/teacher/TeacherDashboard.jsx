import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast, ToastContainer } from '../../components/Toast';
import './TeacherDashboard.css';

const API_URL = 'http://127.0.0.1:8000';

function TeacherDashboard() {
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [vistaActual, setVistaActual] = useState('mis-quices');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [quices, setQuices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        console.log('UserProfile:', userProfile);

        // Buscar el ID del docente - puede ser 'id' o 'firebase_uid'
        const creatorId = userProfile?.id || userProfile?.firebase_uid;
        if (!creatorId) {
          setError('No se encontró el perfil del usuario');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/quiz/creator/${creatorId}`);
        console.log('Quizzes del backend:', response.data);

        // Mapear campos del backend (inglés) al frontend (español)
        const quizzesMapeados = (response.data || []).map(quiz => ({
          id: quiz.id,
          titulo: quiz.title,
          descripcion: quiz.description,
          codigo_acceso: quiz.access_code,
          question_count: quiz.question_count || 0,
          difficulty_level: quiz.difficulty_level,
          is_active: quiz.is_active
        }));

        setQuices(quizzesMapeados);
      } catch (err) {
        console.error('Error al obtener quizzes:', err);
        setError('Error al cargar los quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const quicesFiltrados = quices.filter(q =>
    q.titulo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const cerrarMenus = () => setMenuAbierto(null);

  const eliminarQuiz = async (quizId) => {
    try {
      // Convertir a string ya que el backend espera string
      const quizIdStr = String(quizId);
      await axios.delete(`${API_URL}/quiz/eliminar_quiz/${quizIdStr}`);
      // Actualizar la lista local eliminando el quiz
      setQuices(quices.filter(q => String(q.id) !== quizIdStr));
      setMenuAbierto(null);
      showToast('Quiz eliminado correctamente', 'success');
    } catch (err) {
      console.error('Error al eliminar quiz:', err);
      showToast('Error al eliminar el quiz', 'error');
    }
  };

  return (
    <div className="dashboard-container" onClick={cerrarMenus}>

      {/* Sidebar */}
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
            className={`sidebar-btn ${vistaActual === 'mis-quices' ? 'active' : ''}`}
            onClick={() => setVistaActual('mis-quices')}
          >
            Mis Quices
          </button>
            <button
            className={`sidebar-btn ${vistaActual === 'crear-quiz' ? 'active' : ''}`}
            onClick={() => navigate('/teacher/create')}
            >
            Crear Quiz
            </button>
        </nav>
      </aside>

      {/* Botón flotante cuando sidebar está colapsado */}
      {sidebarCollapsed && (
        <button
          className="sidebar-collapsed-toggle"
          onClick={() => setSidebarCollapsed(false)}
        >
          ☰
        </button>
      )}

      {/* Contenido principal */}
      <main className="main-content">
        <div className="dashboard-main">

          {vistaActual === 'mis-quices' && (
            <>
              {/* Barra de búsqueda centrada */}
              <div className="search-section">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Buscar quiz por título..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              {/* Tarjetas de quices */}
              <div className="quices-grid">
                {loading ? (
                  <p className="no-results">Cargando quizzes...</p>
                ) : error ? (
                  <p className="no-results">{error}</p>
                ) : quicesFiltrados.length === 0 ? (
                  <p className="no-results">No se encontraron quices.</p>
                ) : (
                  quicesFiltrados.map(quiz => (
                    <div key={quiz.id} className="quiz-card">
                      <div
                        className="quiz-card-body"
                        onClick={() => navigate(`/teacher/quiz/${quiz.id}`, { state: { quiz } })}
                      >
                        <h3 className="quiz-title">{quiz.titulo}</h3>
                        <p className="quiz-desc">{quiz.descripcion || 'Sin descripción'}</p>
                        <span className="quiz-count">{quiz.question_count} preguntas</span>
                      </div>
                      <div className="quiz-card-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="menu-btn"
                          onClick={(e) => toggleMenu(quiz.id, e)}
                        >
                          ⋮
                        </button>
                        {menuAbierto === quiz.id && (
                          <div className="dropdown-menu">
                            <button onClick={(e) => {
                              e.stopPropagation();
                              eliminarQuiz(quiz.id);
                            }}>
                              🗑️ Borrar quiz
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(quiz.codigo_acceso);
                              showToast('Código copiado al portapapeles', 'success');
                            }}>
                              📋 Copiar código
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              showToast('Próximamente: Vista de estadísticas', 'info');
                            }}>
                              📊 Ver dashboard
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {vistaActual === 'crear-quiz' && (
            <div className="crear-placeholder">
              <h2>Crear Quiz</h2>
              <p>Aquí irá el formulario para crear un nuevo quiz.</p>
            </div>
          )}

        </div>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default TeacherDashboard;