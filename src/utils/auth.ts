"use client";

import { auth } from "@/components/Auth/firebaseConfig/firebaseConfig";
import { User } from "firebase/auth";

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const user = localStorage.getItem("user");
  if (!user) return false;

  try {
    const userData = JSON.parse(user);
    return userData.isAuthenticated === true && auth.currentUser !== null;
  } catch {
    return false;
  }
};

// Get the current user
export const getUser = (): {
  email: string;
  name: string;
  isAuthenticated: boolean;
} | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const userData = JSON.parse(user);
    return userData;
  } catch {
    return null;
  }
};

// Log out the user
export const logout = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    await auth.signOut(); // Sign out from Firebase
    localStorage.removeItem("user"); // Clear local storage
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// Listen for authentication state changes
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
