// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC05S3u7P08Hpfb5qtkaZUeUIoL0bZThfs",
  authDomain: "mobile2-ifpe.firebaseapp.com",
  projectId: "mobile2-ifpe",
  storageBucket: "mobile2-ifpe.firebasestorage.app",
  messagingSenderId: "166800077377",
  appId: "1:166800077377:web:641549d7084ed26c620cc0",
};

// Inicialize o Firebase App
const app = initializeApp(firebaseConfig);

// Obtenha a instância de autenticação
const auth = getAuth(app);

export { auth };
