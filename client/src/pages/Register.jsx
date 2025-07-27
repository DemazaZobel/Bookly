import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigator = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const response = await API.post("/register", formData);
      console.log("Registration successful:", response.data);
      navigator("/home")
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      const decodedToken = jwtDecode(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(decodedToken));
      API.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      console.log("Decoded token:", decodedToken);
      


      setShowPassword(false);
      setShowConfirmPassword(false);
      setError(""); 
    } catch (err) {
      const backendError = err.response?.data?.message ;
      console.error("Registration error:", err.response?.data);
      setError(backendError|| "Registration failed");
    }
        
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 shadow-lg border rounded-lg bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border px-4 py-2 rounded"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border px-4 py-2 rounded pr-10"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full border px-4 py-2 rounded pr-10"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
