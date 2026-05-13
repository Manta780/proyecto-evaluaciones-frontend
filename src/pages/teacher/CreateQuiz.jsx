import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';

function CreateQuiz() {
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    cantidad: '',
    tipo: '',
    dificultad: '',
    grado: '',
    longitud: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (file) setArchivo(file);
  };

  const handleCrear = () => {
    if (!form.titulo || !form.descripcion || !archivo || !form.cantidad || !form.tipo) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }
    alert('Quiz creado correctamente.');
    navigate('/teacher/dashboard');
  };

  return (
    <div className="dashboard-container">

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
          <button className="sidebar-btn" onClick={() => navigate('/teacher/dashboard')}>
            Mis Quices
          </button>
          <button className="sidebar-btn active">
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

      {/* Contenido */}
      <main className="main-content">
        <div className="create-main">
          <h2 className="create-title">Crear nuevo Quiz</h2>

          <div className="create-form">

            {/* Título */}
            <div className="form-field full">
              <label>Título del quiz <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Ej: Quiz de Historia Universal"
                value={form.titulo}
                onChange={e => handleChange('titulo', e.target.value)}
              />
            </div>

            {/* Descripción y archivo */}
            <div className="form-row">
              <div className="form-field">
                <label>Descripción <span className="required">*</span></label>
                <textarea
                  placeholder="Describe el contenido del quiz..."
                  value={form.descripcion}
                  onChange={e => handleChange('descripcion', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label>Archivo fuente <span className="required">*</span></label>
                <div
                  className={`file-drop ${archivo ? 'file-loaded' : ''}`}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  {archivo ? (
                    <>
                      <span className="file-icon">📄</span>
                      <span className="file-name">{archivo.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="file-icon">📁</span>
                      <span>Haz clic para subir</span>
                      <span className="file-hint">PDF, DOCX, PPTX</span>
                    </>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  style={{ display: 'none' }}
                  onChange={handleArchivo}
                />
              </div>
            </div>

            {/* Cantidad y tipo */}
            <div className="form-row">
              <div className="form-field">
                <label>Cantidad de preguntas <span className="required">*</span></label>
                <input
                  type="number"
                  placeholder="Ej: 10"
                  min={1}
                  max={50}
                  value={form.cantidad}
                  onChange={e => handleChange('cantidad', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Tipo de quiz <span className="required">*</span></label>
                <div className="tipo-selector">
                  {['Selección múltiple', 'Abierto', 'Verdadero/Falso', 'Mixto'].map(tipo => (
                    <button
                      key={tipo}
                      className={`tipo-btn ${form.tipo === tipo ? 'active' : ''}`}
                      onClick={() => handleChange('tipo', tipo)}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Más detalles */}
            <div className="form-row">
              <div className="form-field">
                <label>Dificultad</label>
                <select
                  value={form.dificultad}
                  onChange={e => handleChange('dificultad', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option>Fácil</option>
                  <option>Media</option>
                  <option>Difícil</option>
                </select>
              </div>

              <div className="form-field">
                <label>Grado de estudiantes</label>
                <select
                  value={form.grado}
                  onChange={e => handleChange('grado', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option>Primaria</option>
                  <option>Secundaria</option>
                  <option>Universidad</option>
                  <option>Profesional</option>
                </select>
              </div>

              <div className="form-field">
                <label>Longitud de preguntas</label>
                <select
                  value={form.longitud}
                  onChange={e => handleChange('longitud', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option>Cortas</option>
                  <option>Largas</option>
                  <option>De análisis</option>
                </select>
              </div>
            </div>

            {/* Botón crear */}
            <div className="create-actions">
              <button className="btn-cancelar" onClick={() => navigate('/teacher/dashboard')}>
                Cancelar
              </button>
              <button className="btn-crear" onClick={handleCrear}>
                Crear Quiz
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateQuiz;