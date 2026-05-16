import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USER_KEY = 'novuUser';
const PROFILE_KEY = 'userProfile';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(load);

  const signup = useCallback(({ name, email, password, phone = '', address = '' }) => {
    if (!name.trim() || !email.trim() || !password) {
      return { error: 'All fields are required.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Enter a valid email address.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }
    const existing = load();
    if (existing?.email?.toLowerCase() === email.trim().toLowerCase()) {
      return { error: 'An account with this email already exists.' };
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    // Seed profile page
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    }));

    setUser(newUser);
    return { ok: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    if (!email.trim() || !password) {
      return { error: 'Email and password are required.' };
    }
    const saved = load();
    if (!saved) {
      return { error: 'No account found. Please sign up first.' };
    }
    if (saved.email !== email.trim().toLowerCase()) {
      return { error: 'Incorrect email or password.' };
    }
    setUser(saved);
    return { ok: true };
  }, []);

  const updateUser = useCallback((fields) => {
    const current = load();
    if (!current) return;
    const updated = { ...current, ...fields };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
