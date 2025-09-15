import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WELCOME_EMOJI = "👋";
const FEEDBACK_EMOJI = "💬";
const PROFILE_EMOJI = "📝";
const API = "http://localhost:5000";

function StudentDashboard() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // After login, get user profile/name from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get(`${API}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setName(res.data.name || "Student"))
    .catch(() => setName("Student"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#e0ffc4 0%,#d6f3ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.96)",
        borderRadius: "19px",
        boxShadow: "0 8px 32px rgba(80,120,160,0.11)",
        maxWidth: "470px",
        width: "100%",
        padding: "54px 44px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "2.7rem", marginBottom: "14px" }}>
          {WELCOME_EMOJI}
        </div>
        <h1 style={{
          fontWeight: 800,
          fontSize: "2.1rem",
          color: "#27687a",
          marginBottom: "11px"
        }}>
          Welcome, {name}!
        </h1>
        <h2 style={{
          fontWeight: 600,
          fontSize: "1.32rem",
          color: "#44b574",
          marginBottom: "38px"
        }}>
          Are you ready to explore?
        </h2>
        <div style={{ display: "flex", gap: "22px", justifyContent: "center", marginBottom: "20px" }}>
          <button
            onClick={() => navigate("/feedback")}
            style={{
              background: "linear-gradient(90deg, #a0f5c9 60%, #96e3fd 100%)",
              color: "#27687a",
              fontWeight: 700,
              fontSize: "1.18rem",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 6px rgba(140,180,180,0.11)",
              padding: "14px 32px",
              letterSpacing: ".01em",
              cursor: "pointer"
            }}
          >
            {FEEDBACK_EMOJI} Give Feedback
          </button>
          <button
            onClick={() => navigate("/profile")}
            style={{
              background: "linear-gradient(90deg,#e7d1fa 60%, #96c3fd 100%)",
              color: "#50277a",
              fontWeight: 700,
              fontSize: "1.18rem",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 6px rgba(160,120,180,0.11)",
              padding: "14px 32px",
              letterSpacing: ".01em",
              cursor: "pointer"
            }}
          >
            {PROFILE_EMOJI} Edit Profile
          </button>
        </div>
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <button onClick={handleLogout} style={{
            background: "#e67870",
            color: "#fff",
            fontWeight: "800",
            fontSize: "1.12rem",
            borderRadius: "9px",
            border: "none",
            padding: "14px 0",
            cursor: "pointer",
            width: "80%",
            maxWidth: "320px",
            margin: "0 auto",
            boxShadow: "0 2px 6px rgba(140,180,180,0.10)"
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
