import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizData } from '../../hooks/useQuizData';
import './StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const { getQuizByCode } = useQuizData();

  const [vista, setVista] = useState('codigo'); // codigo, nombre, quiz, resultados
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState(null);

  // Buscar quiz por código
  const buscarQuiz = () => {
    if (!codigo.trim()) {
      setError('Por favor ingresa un código de quiz.');
      return;
    }
    setLoading(true);
    setError('');

    // Simular búsqueda
    setTimeout(() => {
      const quizEncontrado = getQuizByCode(codigo.trim());
      if (quizEncontrado) {
        setQuiz(quizEncontrado);
        setVista('nombre');
        setLoading(false);
      } else {
        setError('Código de quiz no encontrado. Verifica e intenta nuevamente.');
        setLoading(false);
      }
    }, 500);
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

  // Enviar quiz
  const enviarQuiz = () => {
    let aciertos = 0;
    const detalles = quiz.preguntas.map((preg, idx) => {
      const respuestaEstudiante = respuestas[idx];
      const esCorrecta = respuestaEstudiante === preg.respuesta_correcta;
      if (esCorrecta) aciertos++;
      return {
        pregunta: preg.pregunta,
        respuestaEstudiante,
        respuestaCorrecta: preg.respuesta_correcta,
        esCorrecta,
      };
    });

    setResultados({
      total: quiz.preguntas.length,
      aciertos,
      porcentaje: Math.round((aciertos / quiz.preguntas.length) * 100),
      detalles,
    });
    setVista('resultados');
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

  // Vista: Código
  if (vista === 'codigo') {
    return (
      <div className="student-container">
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

          <div className="question-card">
            <span className="question-number">Pregunta {preguntaActual + 1}</span>
            <p className="question-text">{pregunta.pregunta}</p>

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
                disabled={Object.keys(respuestas).length < quiz.preguntas.length}
              >
                Enviar Quiz ✓
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