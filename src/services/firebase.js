import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase - Replace con tus credenciales
// Obtén estas credenciales desde la Console de Firebase -> Configuración del proyecto
const firebaseConfig = {
    apiKey: "AIzaSyBkm4KN0GKA_Zlc2vPIB1t6JPpUPy2YqJE",
    authDomain: "quizesai.firebaseapp.com",
    projectId: "quizesai",
    storageBucket: "quizesai.appspot.com",
    messagingSenderId: "852386466835",
    appId: "1:852386466835:web:b4f0322245075e2e4ac3e6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log('✓ Firebase inicializado:', app.name);
export const auth = getAuth(app);

export default app;