// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Sua configuração do Firebase
const firebaseConfig = {
  // configurar na hora de apresentar
};

// Inicialize o Firebase App
const app = initializeApp(firebaseConfig);

// Obtenha a instância de autenticação
const auth = getAuth(app);

export { auth };
