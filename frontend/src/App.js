import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./Redux/userSlice";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-blue-700 px-6 py-3 flex items-center justify-between shadow-md">
      <div className="text-white font-extrabold text-2xl tracking-wide drop-shadow-sm">
        <Link to="/">Cura</Link>
      </div>

      <button
        className="md:hidden text-white"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      <div
        className={`flex-col md:flex-row md:flex items-center space-y-2 md:space-y-0 md:space-x-6 ${
          open ? "flex" : "hidden md:flex"
        }`}
      >
        <Link
          to="/chat"
          className="text-white hover:text-blue-200 font-medium transition"
        >
          Chat
        </Link>
        {user ? (
          <button
            onClick={() => dispatch(logout())}
            className="text-white hover:text-blue-200 font-medium transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:text-blue-200 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white hover:text-blue-200 font-medium transition"
            >
              Register
            </Link>
          </>
        )}
        <ThemeToggle/>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
