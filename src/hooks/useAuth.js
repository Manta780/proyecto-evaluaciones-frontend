import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión activa
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      const profile = localStorage.getItem('userProfile');

      if (token && profile) {
        setUser(JSON.parse(profile));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('userProfile');
    setUser(null);
  };

  return { user, loading, logout };
}