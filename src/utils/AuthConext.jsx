import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
const [role, setRole] = useState(null); // nouveau state

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");
  const storedRole = localStorage.getItem("role"); // récupération du rôle

  if (storedToken && storedUserId && storedRole) {
    setToken(storedToken);
    setUserId(storedUserId);
    setRole(storedRole);
  }
}, []);

const login = (newToken, newId, newRole) => {
  setToken(newToken);
  setUserId(newId);
  setRole(newRole);

  localStorage.setItem("token", newToken);
  localStorage.setItem("userId", newId);
  localStorage.setItem("role", newRole); // on stocke aussi le rôle
};

const logOut = () => {
  setToken(null);
  setUserId(null);
  setRole(null);
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role"); // suppression du rôle
};


  return (
    <AuthContext.Provider value={{ token, login, logOut, userId,role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
