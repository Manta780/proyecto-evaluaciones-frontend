import { useState, useEffect } from 'react';

const STORAGE_KEY = 'quizai_quizzes';

const generateUniqueCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const getStoredQuizzes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading quizzes from localStorage:', e);
  }
  return null;
};

const quicesDefault = [
  {
    id: 1,
    titulo: 'Quiz de Historia',
    descripcion: 'Preguntas sobre la Segunda Guerra Mundial',
    codigo: 'HIST1',
    preguntas: [
      { id: 1, pregunta: '¿En qué año comenzó la Segunda Guerra Mundial?', opciones: ['1935', '1939', '1941', '1945'], respuesta_correcta: '1939' },
      { id: 2, pregunta: '¿Quién fue el líder de Alemania Nazi?', opciones: ['Mussolini', 'Hitler', 'Franco', 'Stalin'], respuesta_correcta: 'Hitler' },
      { id: 3, pregunta: '¿Qué tratado firmó Alemania al final de la guerra?', opciones: ['Versailles', 'París', 'Potsdam', 'Bretton Woods'], respuesta_correcta: 'Potsdam' },
    ],
  },
  {
    id: 2,
    titulo: 'Quiz de Matemáticas',
    descripcion: 'Álgebra y ecuaciones básicas',
    codigo: 'MATH1',
    preguntas: [
      { id: 1, pregunta: '¿Cuánto es 5 + 3 × 2?', opciones: ['16', '11', '13', '20'], respuesta_correcta: '11' },
      { id: 2, pregunta: 'Resuelve: 2x + 5 = 15', opciones: ['x = 10', 'x = 5', 'x = 7', 'x = 4'], respuesta_correcta: 'x = 5' },
    ],
  },
  {
    id: 3,
    titulo: 'Quiz de Biología',
    descripcion: 'Células y organismos vivos',
    codigo: 'BIO1',
    preguntas: [
      { id: 1, pregunta: '¿Cuál es la unidad básica de la vida?', opciones: ['Átomo', 'Molécula', 'Célula', 'Tejido'], respuesta_correcta: 'Célula' },
      { id: 2, pregunta: '¿Qué organelo produce energía?', opciones: ['Núcleo', 'Mitocondria', 'Ribosoma', 'Lisosoma'], respuesta_correcta: 'Mitocondria' },
      { id: 3, pregunta: '¿Cómo se llama la división celular normal?', opciones: ['Mitosis', 'Meiosis', 'Fisión', 'Citocinesis'], respuesta_correcta: 'Mitosis' },
    ],
  },
];

export function useQuizData() {
  const [quizzes, setQuizzes] = useState(() => {
    const stored = getStoredQuizzes();
    return stored || quicesDefault;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  const addQuiz = (quiz) => {
    const newQuiz = {
      ...quiz,
      id: Date.now(),
      codigo: generateUniqueCode(),
    };
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz;
  };

  const updateQuiz = (id, updates) => {
    setQuizzes(prev =>
      prev.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  };

  const deleteQuiz = (id) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  const getQuizByCode = (code) => {
    return quizzes.find(q => q.codigo.toUpperCase() === code.toUpperCase());
  };

  const getQuizById = (id) => {
    return quizzes.find(q => q.id === id);
  };

  return {
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizByCode,
    getQuizById,
  };
}

export default useQuizData;