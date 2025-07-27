import React, { useState } from "react";
import API from "../services/api.js"; 
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {  useLocation } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/home";


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.email === "" || formData.password === "") {
        throw new Error("Email and password are required");
      }
    
      const response= await API.post("/login", formData);
      localStorage.setItem("token", response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      localStorage.setItem("user", JSON.stringify(decodedToken));
      
      console.log("Decoded token:", decodedToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      navigate(redirectPath, { replace: true }); 
      console.log("Login successful:", response.data);
      setError("");
      
    } catch (error) {
      const backendError = error.response?.data?.message || error.message;
      console.error("Login error:", backendError);
      setError(backendError || "Login failed");
      
    }
    console.log("Login submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <div
            className="cursor-pointer text-right text-sm text-blue-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
