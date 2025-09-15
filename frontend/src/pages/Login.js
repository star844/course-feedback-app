import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOGIN_EMOJI = "🔐";
const WELCOME_EMOJI = "👋";

const API = "http://localhost:5000";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInput = e =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async e => {
  e.preventDefault();
  setError("");
  try {
    const res = await axios.post(`${API}/api/login`, form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    // Only after saving, redirect to dashboard for correct role
    navigate(res.data.role === "admin" ? "/admin-dashboard" : "/student-dashboard");
  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  }
};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#E0FFC4 0%,#D6F3FF 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "18px",
        boxShadow: "0 8px 28px rgba(40,80,120,0.12)",
        maxWidth: "380px",
        width: "100%",
        padding: "38px 36px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "12px", fontSize: "2rem" }}>
          {LOGIN_EMOJI}
        </div>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.46rem",
          letterSpacing: "0.01em",
          color: "#234567"
        }}>Login</h2>
        <div style={{
          textAlign: "center",
          color: "#74bb8b",
          fontWeight: 600,
          fontSize: "1.08rem",
          marginBottom: "13px"
        }}>
          {WELCOME_EMOJI} Welcome back!
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInput}
            placeholder="Email"
            required
            style={{
              fontSize: "1.09rem",
              borderRadius: "9px",
              border: "1.5px solid #c7dbf4",
              padding: "13px",
              background: "#f7faff"
            }}
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleInput}
            placeholder="Password"
            required
            style={{
              fontSize: "1.09rem",
              borderRadius: "9px",
              border: "1.5px solid #c7dbf4",
              padding: "13px",
              background: "#f7faff"
            }}
          />
          <button type="submit" style={{
            background: "linear-gradient(90deg, #a0f5a9 60%, #96c3fd 100%)",
            color: "#234567",
            fontWeight: 700,
            fontSize: "1.12rem",
            borderRadius: "9px",
            border: "none",
            padding: "15px 0",
            boxShadow: "0 2px 6px rgba(140,180,180,0.10)",
            cursor: "pointer",
            marginTop: "5px"
          }}>
            Login
          </button>
          {error && (
            <div style={{
              textAlign: "center",
              fontWeight: "600",
              fontSize: "1.07rem",
              color: "#e04747",
              marginTop: "3px"
            }}>
              {error}
            </div>
          )}
        </form>
        <div style={{
          textAlign: "center",
          color: "#7a7a7a",
          marginTop: "22px",
          fontSize: "0.98rem"
        }}>
          Don’t have an account?
          <a href="/signup" style={{
            color: "#5a97f5",
            fontWeight: 700,
            textDecoration: "none",
            marginLeft: "7px"
          }}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
