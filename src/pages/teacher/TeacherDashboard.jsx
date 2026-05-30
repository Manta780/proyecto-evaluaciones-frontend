import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizData } from '../../hooks/useQuizData';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const navigate = useNavigate();
  const { quizzes, deleteQuiz } = useQuizData();

  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [vistaActual, setVistaActual] = useState('mis-quices');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const quicesFiltrados = quizzes.filter(q =>
    q.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 3000);
  };

  const copiarCodigo = (codigo, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codigo);
    setMenuAbierto(null);
    mostrarToast(`Código "${codigo}" copiado al portapapeles`);
  };

  const verDashboard = (quiz, e) => {
    e.stopPropagation();
    setMenuAbierto(null);
    navigate(`/teacher/quiz/${quiz.id}/dashboard`, { state: { quiz } });
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const eliminarQuiz = (id, e) => {
    e.stopPropagation();
    deleteQuiz(id);
    setMenuAbierto(null);
    mostrarToast('Quiz eliminado correctamente');
  };

  const cerrarMenus = () => {
    setMenuAbierto(null);
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('userProfile');
    navigate('/');
  };

  return (
    <div className="dashboard-container" onClick={cerrarMenus}>

      {/* Botón cerrar sesión */}
      <button className="logout-btn" onClick={cerrarSesion}>
        🚪 Cerrar sesión
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          className="sidebar-close-btn"
          onClick={() => setSidebarCollapsed(true)}
        >
          ✕
        </button>
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
                {quicesFiltrados.length === 0 ? (
                  <p className="no-results">No se encontraron quices.</p>
                ) : (
                  quicesFiltrados.map(quiz => (
                    <div
                      key={quiz.id}
                      className="quiz-card"
                      onClick={() => navigate(`/teacher/quiz/${quiz.id}`, { state: { quiz } })}
                    >
                      <div className="quiz-card-body">
                        <h3 className="quiz-title">{quiz.titulo}</h3>
                        <p className="quiz-desc">{quiz.descripcion}</p>
                        <div className="quiz-meta">
                          <span className="quiz-count">{quiz.preguntas?.length || 0} preguntas</span>
                          <span className="quiz-code">Código: <code>{quiz.codigo}</code></span>
                        </div>
                      </div>
                      <div className="quiz-card-actions">
                        <button
                          className="menu-btn"
                          onClick={(e) => toggleMenu(quiz.id, e)}
                        >
                          ⋮
                        </button>
                        {menuAbierto === quiz.id && (
                          <div className="dropdown-menu">
                            <button onClick={(e) => eliminarQuiz(quiz.id, e)}>
                              🗑️ Borrar quiz
                            </button>
                            <button onClick={(e) => copiarCodigo(quiz.codigo, e)}>
                              📋 Copiar código
                            </button>
                            <button onClick={(e) => verDashboard(quiz, e)}>
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
      {/* Toast notification */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;