import React, { useState } from "react";
import axios from "axios";

const SIGNUP_EMOJI = "🎉";
const WELCOME_EMOJI = "😊";

const API = "http://localhost:5000";
function Signup({ onSignup }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInput = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API}/api/signup`, form);
      setSuccess("Signup successful! You can login now 🎉");
      if (onSignup) onSignup();
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#d6f3ff 0%,#fde7fa 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "18px",
        boxShadow: "0 8px 28px rgba(80,120,160,0.11)",
        maxWidth: "380px",
        width: "100%",
        padding: "38px 36px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "12px", fontSize: "2rem" }}>
          {SIGNUP_EMOJI}
        </div>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.46rem",
          letterSpacing: "0.01em",
          color: "#6c3798"
        }}>Signup</h2>
        <div style={{
          textAlign: "center",
          color: "#bb7beb",
          fontWeight: 600,
          fontSize: "1.08rem",
          marginBottom: "13px"
        }}>
          {WELCOME_EMOJI} Join us as a student or admin!
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInput}
            placeholder="Name"
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
          <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
            <span style={{ fontWeight: 500, color: "#8456af", fontSize: "1.06rem" }}>Role:</span>
            <select
              name="role"
              value={form.role}
              onChange={handleInput}
              style={{
                fontSize: "1.05rem",
                borderRadius: "7px",
                border: "1.5px solid #c7dbf4",
                padding: "6px 14px",
                background: "#f7faff"
              }}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" style={{
            background: "linear-gradient(90deg, #e7d1fa 60%, #96c3fd 100%)",
            color: "#50277a",
            fontWeight: 700,
            fontSize: "1.13rem",
            borderRadius: "9px",
            border: "none",
            padding: "15px 0",
            boxShadow: "0 2px 6px rgba(160,120,180,0.10)",
            cursor: "pointer",
            marginTop: "5px"
          }}>
            Signup
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
          {success && (
            <div style={{
              textAlign: "center",
              fontWeight: "600",
              fontSize: "1.07rem",
              color: "#20af48",
              marginTop: "3px"
            }}>
              {success}
            </div>
          )}
        </form>
        <div style={{
          textAlign: "center",
          color: "#7a7a7a",
          marginTop: "19px",
          fontSize: "0.97rem"
        }}>
          Already registered?
          <a href="/login" style={{
            color: "#5a97f5",
            fontWeight: 700,
            textDecoration: "none",
            marginLeft: "7px"
          }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
