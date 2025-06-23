import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/image.png";
const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/dealers", label: "Dealers" },
  { to: "/add-dealer", label: "Add Dealer" },
];

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoized callbacks to avoid unnecessary re-renders
const { logout } = useAuth(); // custom hook from context
  const navigate = useNavigate();

const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }
};


  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  // Close sidebar on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    if (sidebarOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <header className="relative w-full overflow-x-hidden">
      {/* ░░ Top bar ░░ */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 flex items-center justify-between shadow">
        <Link to="/" className="flex items-center gap-3">
              
                    <img
                      src={logo}
                      alt="guest-house-logo"
                      className="w-10 h-10 "
                      style={{
                        maxWidth: "250px",
                        maxHeight: "50px",
                        padding: "4px",
                        marginRight: "10px",
                        marginBottom: "2px",
                      }}
                    />
                  
          <motion.h1
            className="text-2xl font-semibold tracking-wide"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Dealers Info
          </motion.h1>
        </Link>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 bg-white text-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
          aria-label="Logout"
        >
          <LogOut className="text-xl" />
          <span className="hidden md:inline group-hover:block">Logout</span>
        </button>
      </div>

      {/* ░░ Secondary bar ░░ */}
      <div className="bg-gray-100 shadow px-6 py-2 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-2xl md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>

        <nav aria-label="Main navigation" className="hidden md:flex gap-6 font-medium text-gray-700">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-blue-600">
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ░░ Mobile Sidebar ░░ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Dimmed backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />

            {/* Sliding panel */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={toggleSidebar} className="text-xl" aria-label="Close sidebar">
                  <X />
                </button>
              </div>

              <ul className="p-4 space-y-4 font-medium flex-1">
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} onClick={toggleSidebar} className="block hover:text-blue-600">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t p-4">
                <button
                  onClick={() => {
                    toggleSidebar();
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-red-600 hover:text-red-700"
                >
                  <LogOut />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default React.memo(Header);
