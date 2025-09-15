import React, { useState, useEffect } from "react";
import axios from "axios";

// Sample emoji for AI + courses
const COURSE_EMOJI = "📚";
const EDIT_EMOJI = "✏️";
const DELETE_EMOJI = "🗑️";
const ADD_EMOJI = "➕";

const API = "http://localhost:5000";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = () => {
    axios.get(`${API}/api/courses`).then((res) => setCourses(res.data));
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!courseName.trim()) {
      setError("Course name required!");
      return;
    }
    if (editId) {
      axios
        .put(`${API}/api/courses/${editId}`, { name: courseName }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          setSuccess("Course updated!");
          setEditId(null);
          setCourseName("");
          fetchCourses();
        })
        .catch(() => setError("Update failed."));
    } else {
      axios
        .post(`${API}/api/courses`, { name: courseName }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          setSuccess("Course added!");
          setCourseName("");
          fetchCourses();
        })
        .catch(() => setError("Add failed."));
    }
  };

  const beginEdit = (course) => {
    setEditId(course.id);
    setCourseName(course.name);
    setError(""); setSuccess("");
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setSuccess("Course deleted!");
        fetchCourses();
      })
      .catch(() => setError("Delete failed."));
  };

  return (
    <div style={{
      minHeight: "100vh", 
      background: "linear-gradient(120deg, #D8F1FF 0%, #FFD6F8 100%)",
      paddingTop: "40px"
    }}>
      <div className="container" style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "18px",
        boxShadow: "0 8px 24px rgba(40,80,180,0.10)",
        maxWidth: "680px",
        margin: "auto",
        padding: "32px 38px"
      }}>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2.1rem",
          letterSpacing: "0.01em",
          color: "#4573C4",
        }}>{COURSE_EMOJI} Course Management</h2>
        
        {/* Add/Edit Course Form in Card */}
        <div style={{
          background: "linear-gradient(90deg, #eaf5ff 0%, #ffe6fc 100%)",
          border: "1.5px solid #e4e9f2",
          borderRadius: "13px",
          padding: "22px 30px",
          boxShadow: "0 2px 18px rgba(148,173,255,0.07)",
          marginBottom: "32px"
        }}>
          <form
            onSubmit={handleAddOrEdit}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "18px",
              flexWrap: "wrap"
            }}
          >
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              style={{
                flex: "2 1 120px",
                minWidth: "160px",
                fontSize: "1.13rem",
                borderRadius: "9px",
                border: "1.5px solid #c7dbf4",
                padding: "11px 16px",
                background: "#f9fdff",
                boxShadow: "inset 0 1px 3px rgba(60,120,220,0.04)"
              }}
            />
            <button type="submit" style={{
              flex: "1 1 100px",
              minWidth: "128px",
              background: "linear-gradient(90deg, #89f5dd 60%, #a489ff 100%)",
              color: "#333",
              borderRadius: "9px",
              padding: "12px 0",
              fontSize: "1.15rem",
              fontWeight: "700",
              border: "none",
              boxShadow: "0 2px 6px rgba(90,120,170,0.09)",
              cursor: "pointer"
            }}>
              {editId ? `${EDIT_EMOJI} Update Course` : `${ADD_EMOJI} Add Course`}
            </button>
            {(error || success) && (
              <div style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.07rem",
                color: error ? "#e04747" : "#20af48",
                marginTop: "5px"
              }}>
                {error || success}
              </div>
            )}
          </form>
        </div>

        {/* Course Table */}
        <h3 style={{
          marginTop: "22px",
          color: "#a24ea8",
          fontWeight: 700,
          textAlign: "center",
          fontSize: "1.4rem"
        }}>All Courses</h3>
        <div style={{ overflowX: "auto", marginTop: "18px" }}>
          <table style={{
            width: "100%",
            background: "#f7faff",
            borderCollapse: "collapse",
            border: "1.5px solid #c7dbf4",
            boxShadow: "0 2px 8px rgba(60,80,120,0.10)",
            borderRadius: "13px",
            margin: "0 auto",
            fontSize: "1.06rem",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{
                background: "linear-gradient(90deg, #e0dafd 60%, #dff3fc 100%)"
              }}>
                <th style={{ textAlign: "left", padding: "11px 18px", fontWeight: "700", color: "#5d569f" }}>Course Name</th>
                <th style={{ textAlign: "right", padding: "11px 18px", fontWeight: "700", color: "#5d569f" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #e6e6ea" }}>
                  <td style={{ padding: "13px 19px", fontWeight: "500", color: "#594e8a" }}>
                    {COURSE_EMOJI} {c.name}
                  </td>
                  <td style={{ textAlign: "right", padding: "13px 19px" }}>
                    <button
                      onClick={() => beginEdit(c)}
                      style={{
                        marginRight: "14px",
                        background: "linear-gradient(90deg,#d2effe 60%,#eecbfd 100%)",
                        color: "#494181",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                        borderRadius: "8px",
                        padding: "7px 14px",
                        boxShadow: "0 1px 3px rgba(140,160,255,0.06)",
                        cursor: "pointer"
                      }}
                    >
                      {EDIT_EMOJI} Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{
                        background: "linear-gradient(90deg,#ffc6d9 60%,#fad7c3 100%)",
                        color: "#af2e38",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                        borderRadius: "8px",
                        padding: "7px 14px",
                        boxShadow: "0 1px 3px rgba(160,60,60,0.04)",
                        cursor: "pointer"
                      }}
                    >
                      {DELETE_EMOJI} Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;
