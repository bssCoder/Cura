import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useSelector } from "react-redux";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/api/user/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative">
      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
          Create Your Account
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition mb-2"
        >
          Sign Up
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
