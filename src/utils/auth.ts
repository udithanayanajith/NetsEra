"use client";

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const user = sessionStorage.getItem("user");
  if (!user) return false;

  try {
    const userData = JSON.parse(user);
    return userData.isAuthenticated === true;
  } catch {
    return false;
  }
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = sessionStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const logout = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("user");
};
