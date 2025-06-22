import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
 import { useAuth } from '../context/AuthContext';
 import LoadingSpinner from './LoadingSpinner';
import { User } from "lucide-react";
import api from '../utils/api';
const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  // const { login } = useAuth();
  const { login } = useAuth();
  const handleSignUp = (e) => {
    e.preventDefault();
setLoading(true);
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false); 
      return;
    }
const API_URL = import.meta.env.VITE_API_URL;

  api
  .post(
  `/sign-up` 
    , {
    firstName,
    lastName,
    phone,
    email,
    password,
  })
  .then((res) => {
    const { token, user, message } = res.data;

    if ( user, message,token) {
      
      // ✅ Save the token & user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Optional: if using context API
        login(user, token, user.profileImage || "");

      alert(message || "Signup successful!");
       setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      navigate("/");
    } else {
      alert("Signup failed: No token received");
    
    }
    setLoading(false); 
  })
  .catch((err) => {
  const errorMessage =
    err.response?.data?.error || err.response?.data?.message || "Signup failed";

  if (errorMessage === "User already exists") {
    alert("User already exists. Redirecting to login...");
    navigate("/login"); // 👈 make sure your route is correct
  } else {
    alert(errorMessage);
  }
  setLoading(false);
});
  
  }

  return (
    loading ? (
  <LoadingSpinner />
) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp}>
          {/* First Name */}
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              First Name
            </label>
            <div
              style={{ display: "flex", gap: "10px ", alignItems: "center" }}
            >
              <span className="px-3 text-gray-500">
                <FiUser />
              </span>
          <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
            style={{width: '100%'}}>
                <input
                  type="text"
                  id="firstName"
                  className="p-3 w-full outline-none"
                  style={{ padding: "10px" }}
                  value={firstName}
                  placeholder="Enter your first name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Last Name
            </label>
            <div
              style={{ display: "flex", gap: "10px ", alignItems: "center" }}
            >
              <span className="px-3 text-gray-500">
                <FiUser />
              </span>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
            style={{width: '100%'}}>
                <input
                  type="text"
                  id="lastName"
                  className="p-3 w-full outline-none"
                  style={{ padding: "10px" }}
                  value={lastName}
                  placeholder="Enter your last name"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {/* Last Name */}
          <div className="mb-4">
            <label
              htmlFor="PhoneNumber"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Phone Number
            </label>
            <div
              style={{ display: "flex", gap: "10px ", alignItems: "center" }}
            >
              <span className="px-3 text-gray-500">
                <FaPhoneAlt />
              </span>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
              style={{ width: "100%" }}>
                <input
                  type="tel"
                  id="phone"
                  className="p-3 w-full outline-none"
                  style={{ padding: "10px" }}
                  value={phone}
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <div
              style={{ display: "flex", gap: "10px ", alignItems: "center" }}
            >
              <span className="px-3 text-gray-500">
                <FiMail />
              </span>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
            style={{ width: "100%" }}>
                <input
                  type="email"
                  id="email"
                  className="p-3 w-full outline-none"
                  style={{ padding: "10px" }}
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <div
              style={{ display: "flex", gap: "10px ", alignItems: "center" }}
            >
              <span className="px-3 text-gray-500">
                <FiLock />
              </span>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden
              " style={{ width: "100%" }}>
                <input
                  type="password"
                  id="password"
                  className="p-3 w-full outline-none"
                  style={{ padding: "10px" }}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Confirm Password
            </label>
            <div
              style={{ display: "flex", gap: "10px ", alignItems: "center" }}
            >
              <span className="px-3 text-gray-500">
                <FiLock />
              </span>
          <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
            style={{ width: "100%" }}>
                <input
                  type="password"
                  id="confirmPassword"
                  className="p-3 w-full outline-none"
                    style={{padding: '10px'}}
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            onClick={handleSignUp}
              onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
            className="w-full py-3 bg-blue-900 text-white rounded-md hover:bg-blue-600 focus:outline-none transition-all"
            style={{backgroundColor: hover ? '#0b5394' : '#073763',}}
          >
            Sign Up
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-900 hover:underline">
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>)
  );
};

export default SignUp;
