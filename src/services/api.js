import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

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

export default api;