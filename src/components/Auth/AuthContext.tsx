// AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { signOutUser, onAuthChange, User } from "./firebaseConfig/authService"; // Import onAuthStateChanged

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => Promise<void>; // Add logout to the interface
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  logout: async () => {}, // Provide a default logout function
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOutUser(); // Use the actual logout function from Firebase
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
