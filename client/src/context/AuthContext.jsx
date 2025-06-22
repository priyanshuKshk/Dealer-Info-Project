// context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// 24 hours in milliseconds
const ONE_DAY = 24 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const logoutTimer = useRef(null);

  /* ------------------------------------------------------------------ */
  // Helper: schedule automatic logout
  const scheduleAutoLogout = (ms) => {
    clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => {
      logout();
      navigate("/login");
    }, ms);
  };

  /* ------------------------------------------------------------------ */
  // First run: check if a valid session exists in localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const loginTime = Number(localStorage.getItem("loginTime")); // may be NaN

    if (storedRole === "admin" && loginTime) {
      const elapsed = Date.now() - loginTime;
      if (elapsed < ONE_DAY) {
        setRole("admin"); // ✅ session still good
        scheduleAutoLogout(ONE_DAY - elapsed);
      } else {
        logout(); // ❌ expired
      }
    }

    return () => clearTimeout(logoutTimer.current);
  }, []);

  /* ------------------------------------------------------------------ */
  const login = () => {
    const now = Date.now();
    localStorage.setItem("role", "admin");
    localStorage.setItem("loginTime", now.toString());
    setRole("admin");
    scheduleAutoLogout(ONE_DAY);
  };

  const logout = () => {
    clearTimeout(logoutTimer.current);
    localStorage.removeItem("role");
    localStorage.removeItem("token");      // in case you store JWT
    localStorage.removeItem("loginTime");
    setRole(null);
  };

  /* ------------------------------------------------------------------ */
  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
