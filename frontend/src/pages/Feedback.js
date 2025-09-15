import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FEEDBACK_EMOJI = "💬";
const API = "http://localhost:5000";

function Feedback() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: "", rating: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(() => setError("Could not load courses"));
  }, [token]);

  const handleInput = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    const payload = {
      courseId: parseInt(form.courseId, 10),
      rating: parseInt(form.rating, 10),
      message: form.message
    };
    if (
      !payload.courseId ||
      !payload.rating ||
      !payload.message ||
      !payload.message.trim()
    ) {
      setError("All fields are required");
      return;
    }
    try {
      await axios.post(`${API}/api/feedback`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Feedback submitted!");
      setForm({ courseId: "", rating: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Feedback failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #e0ffc4 0%, #fde7fa 100%)",
      paddingTop: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "18px",
        boxShadow: "0 8px 28px rgba(120,180,160,0.10)",
        maxWidth: "540px",
        width: "100%",
        padding: "38px 36px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "12px", fontSize: "2rem" }}>
          {FEEDBACK_EMOJI}
        </div>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2rem",
          color: "#44b574",
          marginBottom: "26px"
        }}>Share Your Feedback</h2>
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          marginBottom: "0px"
        }}>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleInput}
            required
            style={{
              width: "100%",
              fontSize: "1.1rem",
              borderRadius: "9px",
              border: "1.5px solid #c7dbf4",
              padding: "10px",
              background: "#f9fdff"
            }}
          >
            <option value="">Select Course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            name="rating"
            value={form.rating}
            onChange={handleInput}
            required
            style={{
              width: "100%",
              fontSize: "1.1rem",
              borderRadius: "9px",
              border: "1.5px solid #c7dbf4",
              padding: "10px",
              background: "#f9fdff"
            }}
          >
            <option value="">Rating</option>
            {[1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <textarea
            name="message"
            value={form.message}
            onChange={handleInput}
            placeholder="Type your feedback message here..."
            rows={3}
            required
            style={{
              width: "100%",
              fontSize: "1.09rem",
              borderRadius: "9px",
              border: "1.5px solid #c7dbf4",
              padding: "10px",
              background: "#f9fdff"
            }}
          />
          <button type="submit" style={{
            width: "100%",
            background: "linear-gradient(90deg, #c3f0a9 60%, #c48dfd 100%)",
            color: "#333",
            borderRadius: "9px",
            padding: "12px 0",
            fontSize: "1.15rem",
            fontWeight: "700",
            border: "none",
            boxShadow: "0 2px 6px rgba(90,120,170,0.09)",
            cursor: "pointer"
          }}>
            🚀 Submit
          </button>
          {(error || success) && (
            <div style={{
              width: "100%",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "1.10rem",
              color: error ? "#e04747" : "#20af48",
              marginTop: "7px"
            }}>
              {error || success}
            </div>
          )}
        </form>
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <button onClick={() => navigate("/student-dashboard")} style={{
            background: "#76e3bc",
            color: "#234567",
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
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
