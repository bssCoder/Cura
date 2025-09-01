import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/userSlice";
import API from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/api/user/login", { username, password });
      dispatch(
        setUser({ user: res.data.user || { username }, token: res.data.token })
      );
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
          Login to Cura
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
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
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
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
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition mb-2"
        >
          Login
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
