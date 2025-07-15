import axios from 'axios';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import api from '../utils/api';
const Login = () => {
  const { login, isLoggedIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
   const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();
  setLoading(true);

  api.post('/login', { email, password })
  .then(({ data }) => {
    if (data.token) {                            // ✅ success: token present
      alert("Login successful");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login(data.user, data.token);
      navigate("/");
    } else if (data.error === "Invalid credentials") {
      alert("Wrong email or password");
      setLoading(false);
    } else if (data.error === "Access denied. Admins only.") {
      alert("You must be an admin to log in here.");
      setLoading(false);
    } else {
      alert("Unknown response: " + JSON.stringify(data));
      setLoading(false);
    }
  })
  .catch((err) => {
    alert(err.response?.data?.error || "Server error");
    setLoading(false);
  });
}


  return (
    loading ? (
  <LoadingSpinner />
) : (
    <div className="tagesschrift-regular flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <div style={{display: 'flex',gap:'10px ', alignItems: 'center'}}>
              <span className="px-3 text-gray-500">
                <FiMail />
              </span>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
            style={{width: '100%'}}>
            
              <input
                type="email"
                id="email"
                className="p-3 w-full outline-none"
                style={{padding: '10px', }}
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div style={{display: 'flex',gap:'10px ', alignItems: 'center'}}>
            <span className="px-3 text-gray-500">
                <FiLock />
              </span>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
            style={{width: '100%'}}>
              
              <input
                type="password"
                id="password"
                className="p-3 w-full outline-none flex-grow"
                style={{padding: '10px'}}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          </div>

      <div className="flex flex-col items-center mt-10">
  <motion.button
    type="submit" // ✅ Important!
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    className="text-white px-4 py-2 rounded"
    style={{
      backgroundColor: hover ? '#0b5394' : '#073763',
      transition: 'background-color 0.3s ease',
      cursor: 'pointer',
      borderRadius: '8px'
    }}
  >
    {loading ? 'Logging in...' : 'Login'}
  </motion.button>
</div>

        </form>
      </motion.div>
    </div>)
  );
};

export default Login;
