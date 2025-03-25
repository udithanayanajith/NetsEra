import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsyO9UWMrg6GfyCcbd-mwOKLG4nKBr-ew",
  authDomain: "netsera-b59d9.firebaseapp.com",
  projectId: "netsera-b59d9",
  storageBucket: "netsera-b59d9.firebasestorage.app",
  messagingSenderId: "310766144592",
  appId: "1:310766144592:web:d37a1760d9f4a07545d555",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
