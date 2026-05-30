import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast, ToastContainer } from '../../components/Toast';
import './QuizDetail.css';

const API_URL = 'http://127.0.0.1:8000';

function QuizDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toasts, showToast, removeToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [agregandoNueva, setAgregandoNueva] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    question_type: 'multiple_choice',
    statement: '',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points: 1,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${API_URL}/quiz/obtener_quiz/${id}`);
        const quizData = response.data;

        setQuiz({
          id: quizData.id,
          titulo: quizData.title,
          descripcion: quizData.description,
          codigo: quizData.access_code,
          difficulty_level: quizData.difficulty_level,
        });

        setPreguntas(quizData.questions || []);
      } catch (err) {
        console.error('Error al obtener quiz:', err);
        setError('Error al cargar el quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleEditChange = (id, field, value) => {
    setPreguntas(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const handleOpcionChange = (id, index, value) => {
    setPreguntas(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const nuevasOpciones = [...(p.options || [])];
        nuevasOpciones[index] = value;
        return { ...p, options: nuevasOpciones };
      })
    );
  };

  const handleNuevaOpcionChange = (index, value) => {
    const nuevasOpciones = [...nuevaPregunta.options];
    nuevasOpciones[index] = value;
    setNuevaPregunta({ ...nuevaPregunta, options: nuevasOpciones });
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'multiple_choice': return 'Opción múltiple';
      case 'true_false': return 'Verdadero/Falso';
      case 'short_answer': return 'Respuesta corta';
      default: return type;
    }
  };

  const agregarPregunta = async () => {
    if (!nuevaPregunta.statement.trim()) {
      showToast('Por favor escribe la pregunta', 'error');
      return;
    }

    try {
      // Construir las opciones según el tipo de pregunta
      let opciones;
      if (nuevaPregunta.question_type === 'multiple_choice') {
        opciones = nuevaPregunta.options;
      } else if (nuevaPregunta.question_type === 'true_false') {
        opciones = ['Verdadero', 'Falso'];
      } else {
        opciones = [];
      }

      const response = await axios.post(`${API_URL}/quiz/question/agregar_pregunta/${id}`, {
        question_type: nuevaPregunta.question_type,
        statement: nuevaPregunta.statement,
        options: opciones,
        correct_answer: nuevaPregunta.correct_answer,
        explanation: nuevaPregunta.explanation,
        points: nuevaPregunta.points
      });

      setPreguntas([...preguntas, response.data]);
      showToast('Pregunta agregada correctamente');
      setNuevaPregunta({
        question_type: 'multiple_choice',
        statement: '',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        points: 1,
      });
      setAgregandoNueva(false);
    } catch (err) {
      console.error('Error al agregar pregunta:', err);
      showToast('Error al agregar la pregunta', 'error');
    }
  };

  const eliminarPregunta = async (preguntaId) => {
    try {
      await axios.delete(`${API_URL}/quiz/question/eliminar_pregunta/${preguntaId}`);
      setPreguntas(preguntas.filter(p => p.id !== preguntaId));
      showToast('Pregunta eliminada correctamente');
      setEditandoId(null);
    } catch (err) {
      console.error('Error al eliminar pregunta:', err);
      showToast('Error al eliminar la pregunta', 'error');
    }
  };

  const guardarCambios = async () => {
    try {
      // Guardar cada pregunta modificada
      for (const p of preguntas) {
        // Construir las opciones según el tipo de pregunta
        let opciones;
        if (p.question_type === 'multiple_choice') {
          opciones = p.options;
        } else if (p.question_type === 'true_false') {
          opciones = ['Verdadero', 'Falso'];
        } else {
          opciones = [];
        }

        await axios.put(`${API_URL}/quiz/question/actualizar_pregunta/${p.id}`, {
          question_type: p.question_type,
          statement: p.statement,
          options: opciones,
          correct_answer: p.correct_answer,
          explanation: p.explanation,
          points: p.points
        });
      }
      showToast('Cambios guardados correctamente');
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      showToast('Error al guardar los cambios', 'error');
    }
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
          {loading ? (
            <p className="no-results">Cargando quiz...</p>
          ) : error ? (
            <p className="no-results">{error}</p>
          ) : (
            <>
              <h2 className="detail-title">{quiz?.titulo}</h2>
              <p className="quiz-desc">{quiz?.descripcion}</p>
              <p className="quiz-count">{preguntas.length} preguntas • Código: {quiz?.codigo}</p>

              <div className="preguntas-lista">
                {preguntas.map((p, index) => (
                  <div
                    key={p.id}
                    className={`pregunta-card ${editandoId === p.id ? 'editando' : ''}`}
                    onClick={() => setEditandoId(editandoId === p.id ? null : p.id)}
                  >
                    {editandoId === p.id ? (
                      <div className="pregunta-edit" onClick={e => e.stopPropagation()}>
                        <label>Pregunta {index + 1} ({getQuestionTypeLabel(p.question_type)})</label>
                        <input
                          className="edit-input"
                          value={p.statement}
                          onChange={e => handleEditChange(p.id, 'statement', e.target.value)}
                        />

                        {p.question_type === 'multiple_choice' && (
                          <>
                            <label>Opciones</label>
                            {(p.options || []).map((op, i) => (
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
                              value={p.correct_answer}
                              onChange={e => handleEditChange(p.id, 'correct_answer', e.target.value)}
                            >
                              <option value="">Seleccionar...</option>
                              {(p.options || []).map((op, i) => (
                                <option key={i} value={op}>{op}</option>
                              ))}
                            </select>
                          </>
                        )}

                        {p.question_type === 'true_false' && (
                          <>
                            <label>Respuesta correcta</label>
                            <select
                              className="edit-select"
                              value={p.correct_answer}
                              onChange={e => handleEditChange(p.id, 'correct_answer', e.target.value)}
                            >
                              <option value="">Seleccionar...</option>
                              <option value="true">Verdadero</option>
                              <option value="false">Falso</option>
                            </select>
                          </>
                        )}

                        {p.question_type === 'short_answer' && (
                          <>
                            <label>Respuesta correcta</label>
                            <input
                              className="edit-input"
                              value={p.correct_answer || ''}
                              onChange={e => handleEditChange(p.id, 'correct_answer', e.target.value)}
                            />
                          </>
                        )}

                        <div className="pregunta-actions">
                          <button className="btn-cerrar" onClick={() => setEditandoId(null)}>
                            Cerrar
                          </button>
                          <button className="btn-eliminar" onClick={() => eliminarPregunta(p.id)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pregunta-vista">
                        <p className="pregunta-numero">Pregunta {index + 1} - {getQuestionTypeLabel(p.question_type)}</p>
                        <p className="pregunta-texto">{p.statement}</p>

                        {p.question_type === 'multiple_choice' && (
                          <div className="opciones-lista">
                            {(p.options || []).map((op, i) => (
                              <span
                                key={i}
                                className={`opcion ${op === p.correct_answer ? 'correcta' : ''}`}
                              >
                                {op}
                              </span>
                            ))}
                          </div>
                        )}

                        {p.question_type === 'true_false' && (
                          <div className="opciones-lista">
                            <span className={`opcion ${p.correct_answer === 'true' ? 'correcta' : ''}`}>
                              Verdadero
                            </span>
                            <span className={`opcion ${p.correct_answer === 'false' ? 'correcta' : ''}`}>
                              Falso
                            </span>
                          </div>
                        )}

                        {p.question_type === 'short_answer' && (
                          <div className="opciones-lista">
                            <span className="opcion correcta">Respuesta: {p.correct_answer}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

            {/* Formulario nueva pregunta */}
            {agregandoNueva && (
              <div className="pregunta-card editando" onClick={e => e.stopPropagation()}>
                <div className="pregunta-edit">
                  <label>Tipo de pregunta</label>
                  <select
                    className="edit-select"
                    value={nuevaPregunta.question_type}
                    onChange={e => setNuevaPregunta({
                      ...nuevaPregunta,
                      question_type: e.target.value,
                      options: e.target.value === 'multiple_choice' ? ['', '', '', ''] : [],
                      correct_answer: ''
                    })}
                  >
                    <option value="multiple_choice">Opción múltiple</option>
                    <option value="true_false">Verdadero/Falso</option>
                    <option value="short_answer">Respuesta corta</option>
                  </select>

                  <label>Pregunta</label>
                  <input
                    className="edit-input"
                    placeholder="Escribe la pregunta..."
                    value={nuevaPregunta.statement}
                    onChange={e => setNuevaPregunta({ ...nuevaPregunta, statement: e.target.value })}
                  />

                  {nuevaPregunta.question_type === 'multiple_choice' && (
                    <>
                      <label>Opciones</label>
                      {nuevaPregunta.options.map((op, i) => (
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
                        value={nuevaPregunta.correct_answer}
                        onChange={e => setNuevaPregunta({ ...nuevaPregunta, correct_answer: e.target.value })}
                      >
                        <option value="">Seleccionar...</option>
                        {nuevaPregunta.options.map((op, i) => (
                          <option key={i} value={op}>{op || `Opción ${String.fromCharCode(65 + i)}`}</option>
                        ))}
                      </select>
                    </>
                  )}

                  {nuevaPregunta.question_type === 'true_false' && (
                    <>
                      <label>Respuesta correcta</label>
                      <select
                        className="edit-select"
                        value={nuevaPregunta.correct_answer}
                        onChange={e => setNuevaPregunta({ ...nuevaPregunta, correct_answer: e.target.value })}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="true">Verdadero</option>
                        <option value="false">Falso</option>
                      </select>
                    </>
                  )}

                  {nuevaPregunta.question_type === 'short_answer' && (
                    <>
                      <label>Respuesta correcta</label>
                      <input
                        className="edit-input"
                        placeholder="Respuesta esperada..."
                        value={nuevaPregunta.correct_answer}
                        onChange={e => setNuevaPregunta({ ...nuevaPregunta, correct_answer: e.target.value })}
                      />
                    </>
                  )}

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
              </>
            )}
            </div>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default QuizDetail;