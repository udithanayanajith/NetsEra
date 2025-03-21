import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfySv2g8EpKeovkdeidis5qQRAGeTaUSA",
  authDomain: "netsera-1cf10.firebaseapp.com",
  projectId: "netsera-1cf10",
  storageBucket: "netsera-1cf10.firebasestorage.app",
  messagingSenderId: "37885065636",
  appId: "1:37885065636:web:669de0fcc63bfbf4936931",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
