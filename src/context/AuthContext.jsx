import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    const storedToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

    if (storedUser && storedToken) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch  {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token, rememberMe = false) => {
    // Robust Role Extraction
    const roleData = userData.role || userData.role_name;
    const roleName = typeof roleData === 'object' ? roleData.name : String(roleData);

    const userToStore = {
      ...userData,
      role: roleName 
    };

    setUser(userToStore);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('adminUser', JSON.stringify(userToStore));
    storage.setItem('adminToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  // The "Everything" Permission Check
  const hasRole = (allowedRoles) => {
    if (!user) return false;

    if (user.email === 'superadmin@halimatu.com') return true;

    const userRoleNormalized = String(user.role).toLowerCase().replace(/\s+/g, '');
    
    return allowedRoles.some(role => {
      const allowedNormalized = String(role).toLowerCase().replace(/\s+/g, '');
      return userRoleNormalized === allowedNormalized || userRoleNormalized === 'superadmin';
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);