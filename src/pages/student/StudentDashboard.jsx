import { useState, useEffect, useCallback  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import './StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const { code: codeParam } = useParams();

  const [vista, setVista] = useState('loading'); // loading, codigo, nombre, quiz, resultados
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState(null);

  // Buscar quiz por código (desde URL o input manual)
  const buscarQuizPorCodigo = useCallback(async (codigoBusqueda) => {
    if (!codigoBusqueda?.trim()) {
      setError('Por favor ingresa un código de quiz.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await quizAPI.getQuizByCode(codigoBusqueda.trim());

      if (response.data) {
        // Mapear datos del backend al formato del frontend
        const quizData = response.data;
        console.log('📥 Datos crudos del backend:', quizData);

        // Verificar la estructura de las preguntas
        const rawQuestions = quizData.questions || quizData.preguntas || quizData.items || [];
        console.log('📝 Preguntas crudas:', rawQuestions);

        const quizMapeado = {
          id: quizData.id,
          titulo: quizData.title || quizData.titulo || 'Quiz sin título',
          descripcion: quizData.description || quizData.descripcion,
          codigo: quizData.access_code || quizData.codigo_acceso,
          preguntas: rawQuestions.map((preg, idx) => {
            // El backend usa: statement para la pregunta, options para las opciones
            const textoPregunta = preg.statement || preg.pregunta || preg.question_text || preg.pregunta_text || preg.question || 'Pregunta sin texto';
            const opcionesRaw = preg.options || preg.opciones || preg.answers || [];

            console.log(`Pregunta ${idx + 1}:`, { textoPregunta, opcionesRaw });

            return {
              id: preg.id || idx + 1,
              pregunta: textoPregunta,
              opciones: opcionesRaw,
              // El backend no envía la respuesta correcta al estudiante
              // Se deja vacío para que no se pueda hacer trampas
              respuesta_correcta: '',
            };
          }),
        };
        console.log('✅ Quiz mapeado:', quizMapeado);
        setQuiz(quizMapeado);
        setCodigo(codigoBusqueda);
        setVista('nombre');
      }
    } catch (err) {
      console.error('Error al buscar quiz:', err);
      setError('Código de quiz no encontrado. Verifica e intenta nuevamente.');
      if (codeParam) {
        // Si falló desde URL, redirigir al input manual
        setVista('codigo');
      }
    } finally {
      setLoading(false);
    }
  }, [codeParam]);

  // Cargar quiz por código de URL al iniciar
  useEffect(() => {
    if (codeParam) {
      // Si viene código en la URL, buscar directamente
      buscarQuizPorCodigo(codeParam);
    } else {
      // Si no hay código, mostrar vista de código manual
      setVista('codigo');
    }
  }, [codeParam , buscarQuizPorCodigo]);

  // Buscar quiz por código (desde URL o input manual)
  
  // Buscar quiz manualmente (desde input)
  const buscarQuiz = () => {
    buscarQuizPorCodigo(codigo);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (vista === 'codigo') buscarQuiz();
      else if (vista === 'nombre' && nombre.trim()) iniciarQuiz();
    }
  };

  // Iniciar quiz con nombre
  const iniciarQuiz = () => {
    if (!nombre.trim()) return;
    setVista('quiz');
    setPreguntaActual(0);
    setRespuestas({});
  };

  // Seleccionar respuesta
  const seleccionarRespuesta = (opcion) => {
    setRespuestas({
      ...respuestas,
      [preguntaActual]: opcion,
    });
  };

  // Navegar entre preguntas
  const preguntaSiguiente = () => {
    if (preguntaActual < quiz.preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  // Enviar quiz al backend
  const enviarQuiz = async () => {
    setLoading(true);

    try {
      // Preparar las respuestas en el formato que espera el backend
      const respuestasFormateadas = quiz.preguntas.map((preg, idx) => ({
        question_id: String(preg.id),
        given_answer: respuestas[idx] || '',
      }));

      const payload = {
        student_name: nombre,
        respuestas: respuestasFormateadas,
      };

      console.log('📤 Enviando respuestas:', payload);

      const response = await quizAPI.submitQuiz(codigo, payload);
      const resultadoBackend = response.data;

      console.log('📥 Resultado del backend:', resultadoBackend);

      // Mapear los resultados del backend
      const resultadosRaw = resultadoBackend.results || resultadoBackend.resultados || [];

      // Contar respuestas correctas
      const aciertosReales = resultadosRaw.filter(r => r.is_correct).length;
      const totalPreguntas = resultadosRaw.length;

      const detalles = resultadosRaw.map((r) => ({
        pregunta: r.statement || r.pregunta,
        respuestaEstudiante: r.given_answer,
        respuestaCorrecta: r.correct_answer,
        esCorrecta: r.is_correct,
      }));

      setResultados({
        total: totalPreguntas,
        aciertos: aciertosReales,
        porcentaje: resultadoBackend.total_score || resultadoBackend.percentage || resultadoBackend.porcentaje || Math.round((aciertosReales / totalPreguntas) * 100),
        detalles: detalles,
      });
      setVista('resultados');
    } catch (err) {
      console.error('Error al enviar quiz:', err);
      setError('Error al enviar las respuestas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar todo
  const reiniciar = () => {
    setVista('codigo');
    setCodigo('');
    setNombre('');
    setQuiz(null);
    setRespuestas({});
    setPreguntaActual(0);
    setResultados(null);
  };

  // Cerrar sesión - volver a Landing
  const cerrarSesion = () => {
    navigate('/');
  };

  // Loading inicial
  if (vista === 'loading') {
    return (
      <div className="student-container">
        <div className="student-card">
          <div className="loading-spinner"></div>
          <p>Cargando quiz...</p>
        </div>
      </div>
    );
  }

  // Vista: Código
  if (vista === 'codigo') {
    return (
      <div className="student-container">
      <button className="logout-btn" onClick={cerrarSesion}>
        <img
          src="/cerrar.png"
          alt="Cerrar sesión"
          className="logout-icon"
        />
  
      </button>
        <div className="student-card">
          <h1 className="student-logo">QuizAI</h1>
          <p className="student-subtitle">Ingresa el código para comenzar</p>

          <input
            className="student-input"
            type="text"
            placeholder="Código del quiz"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={handleKeyDown}
            maxLength={10}
            autoFocus
          />

          {error && <p className="student-error">{error}</p>}

          <button
            className="student-btn"
            onClick={buscarQuiz}
            disabled={loading || !codigo.trim()}
          >
            {loading ? 'Buscando...' : 'Ingresar'}
          </button>
        </div>

        <footer className="student-footer">
          <p>© 2026 QuizAI. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }

  // Vista: Nombre
  if (vista === 'nombre') {
    return (
      <div className="student-container">
      <button className="logout-btn" onClick={cerrarSesion}>
        <img
          src="/cerrar.png"
          alt="Cerrar sesión"
          className="logout-icon"
        />
  
      </button>
        <div className="name-view">
          <div className="name-card">
            <h2>{quiz?.titulo}</h2>
            <p>Ingresa tu nombre para comenzar el quiz</p>

            <input
              className="name-input"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />

            <button
              className="student-btn"
              onClick={iniciarQuiz}
              disabled={!nombre.trim()}
            >
              Comenzar Quiz
            </button>

            <button
              className="student-btn secondary"
              onClick={() => {
                setVista('codigo');
                setQuiz(null);
              }}
              style={{ marginTop: 0, background: 'transparent', color: '#666' }}
            >
              ← Cambiar código
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista: Quiz
  if (vista === 'quiz' && quiz) {
    const pregunta = quiz.preguntas[preguntaActual];
    const opciones = pregunta.opciones;
    const respuestaActual = respuestas[preguntaActual];

    return (
      <div className="student-container">
      <button className="logout-btn" onClick={cerrarSesion}>
        <img
          src="/cerrar.png"
          alt="Cerrar sesión"
          className="logout-icon"
        />
  
      </button>
        <div className="quiz-view">
          <div className="quiz-header">
            <h1>{quiz.titulo}</h1>
            <p>Estudiante: {nombre}</p>
            <div className="quiz-progress">
              <div className="progress-bar-container">
                <div
                  className="progress-fill"
                  style={{ width: `${((preguntaActual + 1) / quiz.preguntas.length) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {preguntaActual + 1} / {quiz.preguntas.length}
              </span>
            </div>
          </div>

          <div className="question-card1">
            <span className="question-number">Pregunta {preguntaActual + 1}</span>
            <p className="question-texto">{pregunta.pregunta}</p>

            <div className="options-list">
              {opciones.map((op, idx) => (
                <div
                  key={idx}
                  className={`option-item ${respuestaActual === op ? 'selected' : ''}`}
                  onClick={() => seleccionarRespuesta(op)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{op}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-btn secondary"
              onClick={preguntaAnterior}
              disabled={preguntaActual === 0}
            >
              ← Anterior
            </button>

            {preguntaActual < quiz.preguntas.length - 1 ? (
              <button
                className="nav-btn primary"
                onClick={preguntaSiguiente}
                disabled={!respuestaActual}
              >
                Siguiente →
              </button>
            ) : (
              <button
                className="nav-btn primary"
                onClick={enviarQuiz}
                disabled={loading || Object.keys(respuestas).length < quiz.preguntas.length}
              >
                {loading ? 'Enviando...' : 'Enviar Quiz ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista: Resultados
  if (vista === 'resultados' && resultados) {
    const mensaje = resultados.porcentaje >= 70
      ? '¡Excelente trabajo!'
      : resultados.porcentaje >= 50
        ? '¡Buen esfuerzo!'
        : 'Sigue practicando';

    return (
      <div className="student-container">
      <button className="logout-btn" onClick={cerrarSesion}>
        <img
          src="/cerrar.png"
          alt="Cerrar sesión"
          className="logout-icon"
        />
  
      </button>
        <div className="results-view">
          <div className="results-card">
            <p className="results-label">Tu puntuación</p>
            <h2 className="results-score">
              {resultados.aciertos}/{resultados.total}
            </h2>
            <div className="results-percentage">
              {resultados.porcentaje}%
            </div>
            <p className="results-message">{mensaje}</p>
          </div>

          <div className="results-questions">
            {resultados.detalles.map((detalle, idx) => (
              <div key={idx} className="result-question-card">
                <div className="result-question-header">
                  <span className="result-question-number">Pregunta {idx + 1}</span>
                  <span className={`result-status ${detalle.esCorrecta ? 'correct' : 'incorrect'}`}>
                    {detalle.esCorrecta ? '✓ Correcto' : '✗ Incorrecto'}
                  </span>
                </div>
                <p className="result-question-text">{detalle.pregunta}</p>
                <div className="result-answers">
                  <div className={`result-answer your-answer ${!detalle.esCorrecta ? 'incorrect' : ''}`}>
                    <span className="result-answer-icon">
                      {detalle.esCorrecta ? '✓' : '✗'}
                    </span>
                    <span>Tu respuesta: <strong>{detalle.respuestaEstudiante}</strong></span>
                  </div>
                  {!detalle.esCorrecta && (
                    <div className="result-answer correct-answer">
                      <span className="result-answer-icon">✓</span>
                      <span>Respuesta correcta: <strong>{detalle.respuestaCorrecta}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button className="results-btn secondary" onClick={reiniciar}>
              ← Volver al inicio
            </button>
            <button className="results-btn primary" onClick={reiniciar}>
              Hacer otro quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default StudentDashboard;