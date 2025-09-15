import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState({
    courseId: "",
    rating: "",
    studentName: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }
  axios
    .get(`${API}/api/admin/feedback`, {   // <---- FIXED endpoint!
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFeedbacks(res.data || []));

  axios
    .get(`${API}/api/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCourses(res.data || []));
}, [navigate, token]);


  // Filtering logic
  const filteredFeedbacks = feedbacks.filter(feedback => {
    return (
      (filter.courseId === "" || feedback.courseId === Number(filter.courseId)) &&
      (filter.rating === "" || feedback.rating === Number(filter.rating)) &&
      (filter.studentName === "" ||
        feedback.studentName.toLowerCase().includes(filter.studentName.toLowerCase()))
    );
  });

  // CSV Download
  const handleDownloadCSV = () => {
    const headers = ["Course", "Rating", "Student", "Message"];
    const rows = filteredFeedbacks.map(fb => [
      fb.courseName,
      fb.rating,
      fb.studentName,
      `"${fb.message.replace(/"/g, '""')}"`
    ]);
    let csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feedbacks.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #fafedc 0%, #e7f4fd 100%)",
      padding: "38px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(80,120,160,0.13)",
        width: "800px",
        maxWidth: "98vw",
        padding: "32px 30px"
      }}>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2.03rem",
          color: "#44b574",
          marginBottom: "8px"
        }}>
          All Student Feedback
        </h2>
        {/* Filters */}
        <div style={{
          display: "flex",
          gap: "18px",
          marginBottom: "26px",
          flexWrap: "wrap"
        }}>
          <select
            value={filter.courseId}
            onChange={e => setFilter(f => ({ ...f, courseId: e.target.value }))}
            style={{
              padding: "8px",
              borderRadius: "7px",
              border: "1px solid #eee",
              minWidth: "150px"
            }}
          >
            <option value="">All Courses</option>
            {courses.map(c => (
              <option value={c.id} key={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filter.rating}
            onChange={e => setFilter(f => ({ ...f, rating: e.target.value }))}
            style={{
              padding: "8px",
              borderRadius: "7px",
              border: "1px solid #eee",
              minWidth: "110px"
            }}
          >
            <option value="">All Ratings</option>
            {[1,2,3,4,5].map(r =>
              <option value={r} key={r}>{r}</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Search by student name"
            value={filter.studentName}
            onChange={e => setFilter(f => ({ ...f, studentName: e.target.value }))}
            style={{
              padding: "8px",
              borderRadius: "7px",
              border: "1px solid #eee",
              minWidth: "180px"
            }}
          />
          <button
            onClick={handleDownloadCSV}
            style={{
              background: "linear-gradient(90deg, #b7fead 40%, #a4d5f7 100%)",
              color: "#2454a3",
              fontWeight: "700",
              borderRadius: "8px",
              border: "none",
              padding: "8px 18px",
              fontSize: "1rem",
              cursor: "pointer"
            }}>
            Download CSV
          </button>
        </div>
        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fdfff7"
          }}>
            <thead>
              <tr style={{ background: "#f8f0ff" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Course</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Rating</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Student</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#b5b6d5"
                  }}>
                    No feedbacks found for current filter.
                  </td>
                </tr>
              ) : filteredFeedbacks.map((fb, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{fb.courseName}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{fb.rating}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{fb.studentName}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{fb.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => navigate("/admin-dashboard")} style={{
  background: "#a4b8f7",
  color: "#fff",
  fontWeight: "800",
  fontSize: "1.14rem",
  borderRadius: "8px",
  border: "none",
  padding: "12px",
  cursor: "pointer",
  width: "100%",
  marginTop: "30px"
}}>
  Back to Profile
        </button>
      </div>
    </div>
  );
}

export default AdminFeedback;
