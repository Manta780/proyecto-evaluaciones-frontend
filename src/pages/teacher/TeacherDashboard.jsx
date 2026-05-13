import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const quicesEjemplo = [
  { id: 1, titulo: 'Quiz de Historia', descripcion: 'Preguntas sobre la Segunda Guerra Mundial', preguntas: 10, codigo: 'ABC123' },
  { id: 2, titulo: 'Quiz de Matemáticas', descripcion: 'Álgebra y ecuaciones básicas', preguntas: 8, codigo: 'DEF456' },
  { id: 3, titulo: 'Quiz de Biología', descripcion: 'Células y organismos vivos', preguntas: 12, codigo: 'GHI789' },
];

function TeacherDashboard() {
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [vistaActual, setVistaActual] = useState('mis-quices');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const quicesFiltrados = quicesEjemplo.filter(q =>
    q.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const cerrarMenus = () => setMenuAbierto(null);

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
                        <span className="quiz-count">{quiz.preguntas} preguntas</span>
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
                            <button onClick={() => alert('Quiz borrado')}>
                              🗑️ Borrar quiz
                            </button>
                            <button onClick={() => {
                              navigator.clipboard.writeText(quiz.codigo);
                              alert(`Código copiado: ${quiz.codigo}`);
                            }}>
                              📋 Copiar código
                            </button>
                            <button onClick={() => alert('Ver dashboard')}>
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
    </div>
  );
}

export default TeacherDashboard;