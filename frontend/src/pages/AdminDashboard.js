import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";
const DASH_EMOJI = "🛡️";

function AdminDashboard() {
  const [adminName, setAdminName] = useState("");
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [avgRatings, setAvgRatings] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    // Get admin name
    axios.get(`${API}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setAdminName(res.data.name || "Admin"));

    // Get global dashboard stats
    axios.get(`${API}/api/admin-dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setTotalFeedback(res.data.feedbackCount || 0);
      setStudentCount(res.data.studentCount || 0);
      setAvgRatings(res.data.avgRatings || []); // [{courseName, avgRating}]
    });
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #dee6ff 0%, #f2fdd7 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(80,120,160,0.13)",
        width: "540px",
        maxWidth: "96vw",
        padding: "38px 38px"
      }}>
        <div style={{ textAlign: "center", fontSize: "2rem" }}>{DASH_EMOJI}</div>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2.03rem",
          color: "#2454a3",
          marginBottom: "8px"
        }}>
          Welcome, {adminName}!
        </h2>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          marginBottom: "26px"
        }}>
          <div style={{
            flex: 1,
            background: "#edf2fd",
            borderRadius: "12px",
            padding: "18px",
            textAlign: "center",
            fontWeight: 700,
            color: "#367882"
          }}>
            Total Feedbacks<br />
            <span style={{
              display: "block",
              fontWeight: "900",
              fontSize: "2rem",
              color: "#44b574"
            }}>{totalFeedback}</span>
          </div>
          <div style={{
            flex: 1,
            background: "#f7faf3",
            borderRadius: "12px",
            padding: "18px",
            textAlign: "center",
            fontWeight: 700,
            color: "#6f4a7b"
          }}>
            Registered Students<br />
            <span style={{
              display: "block",
              fontWeight: "900",
              fontSize: "2rem",
              color: "#b283c4"
            }}>{studentCount}</span>
          </div>
        </div>
        <div style={{ marginBottom: "22px"}}>
          <h3 style={{
            fontWeight: "700",
            color: "#4f9388",
            fontSize: "1.18rem",
            marginBottom: "7px"
          }}>Average Ratings Per Course</h3>
          {avgRatings.length === 0 ? (
            <div style={{
              background: "#f0fde4",
              borderRadius: "9px",
              color: "#7d9b7e",
              padding: "10px",
              textAlign: "center"
            }}>
              No feedback trends yet.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {avgRatings.map(c =>
                <li key={c.courseName} style={{
                  marginBottom: "6px",
                  padding: "7px 13px",
                  borderRadius: "7px",
                  background: "#eef9fe",
                  color: "#236f68",
                  fontWeight: "600"
                }}>
                  {c.courseName}: <span style={{
                    color: "#2abb53",
                    fontWeight: "800"
                  }}>{c.avgRating.toFixed(2)}/5</span>
                </li>
              )}
            </ul>
          )}
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "30px"
        }}>
          <button onClick={() => navigate("/admin-feedback")} style={{
            background: "linear-gradient(90deg, #e8eee7 60%, #8fdafb 100%)",
            color: "#2886c2",
            fontWeight: "700",
            fontSize: "1.16rem",
            borderRadius: "10px",
            border: "none",
            padding: "16px",
            cursor: "pointer"
          }}>
            View All Feedbacks
          </button>
          <button onClick={() => navigate("/admin-students")} style={{
            background: "linear-gradient(90deg, #f5d8fc 60%, #b6e2cf 100%)",
            color: "#a12b7f",
            fontWeight: "700",
            fontSize: "1.16rem",
            borderRadius: "10px",
            border: "none",
            padding: "16px",
            cursor: "pointer"
          }}>
            Manage Students
          </button>
          <button onClick={() => navigate("/admin-courses")} style={{
            background: "linear-gradient(90deg, #d2fcb3 60%, #e9d5fb 100%)",
            color: "#44b574",
            fontWeight: "700",
            fontSize: "1.16rem",
            borderRadius: "10px",
            border: "none",
            padding: "16px",
            cursor: "pointer"
          }}>
            Manage Courses
          </button>
        </div>
        <button onClick={handleLogout} style={{
          background: "#e67870",
          color: "#fff",
          fontWeight: "800",
          fontSize: "1.14rem",
          borderRadius: "8px",
          border: "none",
          padding: "12px",
          cursor: "pointer",
          width: "100%",
          marginTop: "8px"
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
