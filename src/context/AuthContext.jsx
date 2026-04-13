import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    const storedToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token, rememberMe = false) => {
    const userToStore = {
      ...userData,
      role: userData.role || userData.role_name || { name: "Admin" }
    };

    setUser(userToStore);

    if (rememberMe) {
      localStorage.setItem('adminUser', JSON.stringify(userToStore));
      localStorage.setItem('adminToken', token);
    } else {
      sessionStorage.setItem('adminUser', JSON.stringify(userToStore));
      sessionStorage.setItem('adminToken', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
  };

  const hasRole = (allowedRoles) => {
    if (!user?.role) return false;
    const userRole = typeof user.role === 'object' 
      ? user.role.name?.toLowerCase() 
      : String(user.role).toLowerCase();
    
    return allowedRoles.map(r => r.toLowerCase()).includes(userRole);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);