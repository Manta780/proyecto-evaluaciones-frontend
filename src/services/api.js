import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/quiz';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  verifyToken: (firebaseToken) =>
    api.post('/auth/verify', { token: firebaseToken }),

  testUser: (uid) =>
    api.get(`/auth/test-user/${uid}`),
};

// Register API
export const registerAPI = {
  register: (userData) =>
    api.post('/register/', userData),

  getProfile: (profileId) =>
    api.get(`/register/${profileId}`),

  getProfileByFirebaseUid: (firebaseUid) =>
    api.get(`/register/firebase/${firebaseUid}`),

  firebaseLogin: (firebaseToken) =>
    api.post('/register/firebase/login', { token: firebaseToken }),
};

// Quiz API - Endpoints para estudiantes
export const quizAPI = {
  // Obtener quiz por código de acceso
  getQuizByCode: (accessCode) =>
    api.get(`/code/${accessCode}`),

  // Obtener quiz por ID
  getQuizById: (quizId) =>
    api.get(`/quiz/obtener_quiz/${quizId}`),

  // Enviar respuestas del estudiante
  submitQuiz: (accessCode, data) =>
    api.post(`/code/${accessCode}/submit`, data),

  // Resultados del quiz para el docente
  getQuizResults: (quizId) =>
    api.get(`/quiz/${quizId}/results`),

  // Lista de estudiantes con sus calificaciones
  getStudentsScores: (quizId) =>
    api.get(`/quiz/${quizId}/scores`),
};

export default api;