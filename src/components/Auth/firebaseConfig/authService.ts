// authService.ts
import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    localStorage.setItem(
      "user",
      JSON.stringify({ email: user.email, name, isAuthenticated: true })
    );
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: user.email,
        name: user.displayName,
        isAuthenticated: true,
      })
    );
    return user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
  } catch (error) {
    throw error;
  }
};

export const checkAuth = (): boolean => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).isAuthenticated : false;
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
export type { User };
