// Import Firebase core + services we need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBF6F3S1xPZpQoLJsglptYKGhbHs-uSO2A",
  authDomain: "mathanai-family.firebaseapp.com",
  projectId: "mathanai-family",
  storageBucket: "mathanai-family.firebasestorage.app",
  messagingSenderId: "244305062869",
  appId: "1:244305062869:web:47a4510d941e8e375fab5c",
  measurementId: "G-H2RDBQRFTD",
};

// Init Firebase App
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
