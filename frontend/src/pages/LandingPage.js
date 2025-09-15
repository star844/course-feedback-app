import React from "react";

const WELCOME_EMOJI = "🤗";
const EXPLORE_EMOJI = "🌟";

function LandingPage() {
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
        borderRadius: "22px",
        boxShadow: "0 8px 32px rgba(80,120,160,0.15)",
        maxWidth: "470px",
        width: "100%",
        padding: "54px 44px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "2.8rem", marginBottom: "18px" }}>
          {WELCOME_EMOJI}
        </div>
        <h1 style={{
          fontWeight: 800,
          fontSize: "2.1rem",
          color: "#27687a",
          marginBottom: "13px",
          letterSpacing: ".03em"
        }}>Welcome!</h1>
        <h2 style={{
          fontWeight: 600,
          fontSize: "1.38rem",
          color: "#7bbfa7",
          marginBottom: "44px"
        }}>
          {EXPLORE_EMOJI} Are you ready to explore?
        </h2>
        <div style={{ display: "flex", gap: "22px", justifyContent: "center" }}>
          <a href="/signup" style={{
            background: "linear-gradient(90deg, #a0f5c9 60%, #96e3fd 100%)",
            color: "#27687a",
            fontWeight: 700,
            fontSize: "1.23rem",
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 2px 6px rgba(140,180,180,0.11)",
            padding: "16px 41px",
            textDecoration: "none",
            letterSpacing: ".01em",
            cursor: "pointer",
            transition: "background 0.18s"
          }}>
            Signup
          </a>
          <a href="/login" style={{
            background: "linear-gradient(90deg,#e7d1fa 60%, #96c3fd 100%)",
            color: "#50277a",
            fontWeight: 700,
            fontSize: "1.23rem",
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 2px 6px rgba(160,120,180,0.11)",
            padding: "16px 41px",
            textDecoration: "none",
            letterSpacing: ".01em",
            cursor: "pointer",
            transition: "background 0.18s"
          }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
