import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuizDetail.css';

const preguntasEjemplo = [
  {
    id: 1,
    pregunta: '¿En qué año comenzó la Segunda Guerra Mundial?',
    opciones: ['A) 1935', 'B) 1939', 'C) 1941', 'D) 1945'],
    respuesta_correcta: 'B) 1939',
  },
  {
    id: 2,
    pregunta: '¿Quién lideró las fuerzas aliadas en Europa?',
    opciones: ['A) Churchill', 'B) Roosevelt', 'C) Eisenhower', 'D) De Gaulle'],
    respuesta_correcta: 'C) Eisenhower',
  },
];

function QuizDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz || { titulo: 'Quiz de Historia', descripcion: 'Preguntas sobre la Segunda Guerra Mundial', preguntas: 10, codigo: 'ABC123' };

  const [preguntas, setPreguntas] = useState(preguntasEjemplo);
  const [editandoId, setEditandoId] = useState(null);
  const [agregandoNueva, setAgregandoNueva] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    pregunta: '',
    opciones: ['', '', '', ''],
    respuesta_correcta: '',
  });

  const handleEditChange = (id, field, value) => {
    setPreguntas(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const handleOpcionChange = (id, index, value) => {
    setPreguntas(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const nuevasOpciones = [...p.opciones];
        nuevasOpciones[index] = value;
        return { ...p, opciones: nuevasOpciones };
      })
    );
  };

  const handleNuevaOpcionChange = (index, value) => {
    const nuevasOpciones = [...nuevaPregunta.opciones];
    nuevasOpciones[index] = value;
    setNuevaPregunta({ ...nuevaPregunta, opciones: nuevasOpciones });
  };

  const agregarPregunta = () => {
    if (!nuevaPregunta.pregunta.trim()) return;
    const nueva = {
      id: Date.now(),
      ...nuevaPregunta,
    };
    setPreguntas([...preguntas, nueva]);
    setNuevaPregunta({ pregunta: '', opciones: ['', '', '', ''], respuesta_correcta: '' });
    setAgregandoNueva(false);
  };

  const guardarCambios = () => {
    alert('Cambios guardados correctamente.');
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
          <button className="sidebar-btn active" onClick={() => navigate('/teacher/dashboard')}>
            Mis Quices
          </button>
          <button className="sidebar-btn" onClick={() => navigate('/teacher/dashboard')}>
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
        <div className="detail-main">
          <h2 className="detail-title">{quiz.titulo}</h2>
          <p className="quiz-desc">{quiz.descripcion}</p>
          <p className="quiz-count">{quiz.preguntas} preguntas • Código: {quiz.codigo}</p>

          <div className="preguntas-lista">
            {preguntas.map((p, index) => (
              <div
                key={p.id}
                className={`pregunta-card ${editandoId === p.id ? 'editando' : ''}`}
                onClick={() => setEditandoId(editandoId === p.id ? null : p.id)}
              >
                {editandoId === p.id ? (
                  <div className="pregunta-edit" onClick={e => e.stopPropagation()}>
                    <label>Pregunta {index + 1}</label>
                    <input
                      className="edit-input"
                      value={p.pregunta}
                      onChange={e => handleEditChange(p.id, 'pregunta', e.target.value)}
                    />
                    <label>Opciones</label>
                    {p.opciones.map((op, i) => (
                      <input
                        key={i}
                        className="edit-input"
                        value={op}
                        onChange={e => handleOpcionChange(p.id, i, e.target.value)}
                      />
                    ))}
                    <label>Respuesta correcta</label>
                    <select
                      className="edit-select"
                      value={p.respuesta_correcta}
                      onChange={e => handleEditChange(p.id, 'respuesta_correcta', e.target.value)}
                    >
                      {p.opciones.map((op, i) => (
                        <option key={i} value={op}>{op}</option>
                      ))}
                    </select>
                    <button className="btn-cerrar" onClick={() => setEditandoId(null)}>
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <div className="pregunta-vista">
                    <p className="pregunta-numero">Pregunta {index + 1}</p>
                    <p className="pregunta-texto">{p.pregunta}</p>
                    <div className="opciones-lista">
                      {p.opciones.map((op, i) => (
                        <span
                          key={i}
                          className={`opcion ${op === p.respuesta_correcta ? 'correcta' : ''}`}
                        >
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Formulario nueva pregunta */}
            {agregandoNueva && (
              <div className="pregunta-card editando" onClick={e => e.stopPropagation()}>
                <div className="pregunta-edit">
                  <label>Nueva pregunta</label>
                  <input
                    className="edit-input"
                    placeholder="Escribe la pregunta..."
                    value={nuevaPregunta.pregunta}
                    onChange={e => setNuevaPregunta({ ...nuevaPregunta, pregunta: e.target.value })}
                  />
                  <label>Opciones</label>
                  {nuevaPregunta.opciones.map((op, i) => (
                    <input
                      key={i}
                      className="edit-input"
                      placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                      value={op}
                      onChange={e => handleNuevaOpcionChange(i, e.target.value)}
                    />
                  ))}
                  <label>Respuesta correcta</label>
                  <select
                    className="edit-select"
                    value={nuevaPregunta.respuesta_correcta}
                    onChange={e => setNuevaPregunta({ ...nuevaPregunta, respuesta_correcta: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    {nuevaPregunta.opciones.map((op, i) => (
                      <option key={i} value={op}>{op || `Opción ${String.fromCharCode(65 + i)}`}</option>
                    ))}
                  </select>
                  <div className="nueva-actions">
                    <button className="btn-cerrar" onClick={() => setAgregandoNueva(false)}>
                      Cancelar
                    </button>
                    <button className="btn-agregar-confirm" onClick={agregarPregunta}>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones inferiores */}
          <div className="detail-actions">
            <button className="btn-nueva" onClick={() => setAgregandoNueva(true)}>
              + Nueva pregunta
            </button>
            <button className="btn-guardar" onClick={guardarCambios}>
              Guardar cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizDetail;