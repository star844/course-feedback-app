import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCourses();
    // eslint-disable-next-line
  }, [token, navigate]);

  const fetchCourses = () => {
    setLoading(true);
    axios
      .get(`${API}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCourses(res.data || []))
      .finally(() => setLoading(false));
  };

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add or Edit Course
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      await axios.put(
        `${API}/api/courses/${editId}`,
        { name: form.name, description: form.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        `${API}/api/courses`,
        { name: form.name, description: form.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    setForm({ name: "", description: "" });
    setEditId(null);
    fetchCourses();
  };

  // Edit Course
  const handleEdit = course => {
    setForm({ name: course.name, description: course.description || "" });
    setEditId(course.id);
  };

  // Delete Course
  const handleDelete = async id => {
    if (window.confirm("Delete this course?")) {
      await axios.delete(`${API}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    }
  };

 
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #fcfdde 0%, #e7f9fd 100%)",
      padding: "38px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(80,120,160,0.13)",
        width: "700px",
        maxWidth: "98vw",
        padding: "32px 30px"
      }}>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2rem",
          color: "#44b574",
          marginBottom: "18px"
        }}>
          Manage Courses
        </h2>
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          gap: "14px",
          marginBottom: "23px"
        }}>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleInput}
            placeholder="Course Name"
            required
            style={{
              padding: "10px",
              borderRadius: "7px",
              border: "1px solid #bde2e8",
              width: "180px"
            }}
          />
          <input
            name="description"
            type="text"
            value={form.description}
            onChange={handleInput}
            placeholder="Description"
            style={{
              padding: "10px",
              borderRadius: "7px",
              border: "1px solid #bde2e8",
              width: "220px"
            }}
          />
          <button type="submit" style={{
            background: "linear-gradient(90deg, #b7fead 40%, #a4d5f7 100%)",
            color: "#2454a3",
            fontWeight: "700",
            borderRadius: "8px",
            border: "none",
            padding: "10px 22px",
            fontSize: "1rem",
            cursor: "pointer"
          }}>
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button type="button" onClick={() => {
              setForm({ name: "", description: "" });
              setEditId(null);
            }} style={{
              background: "#ebebed",
              color: "#885d9e",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              padding: "10px 11px",
              fontSize: "1rem",
              cursor: "pointer",
              marginLeft: "6px"
            }}>
              Cancel
            </button>
          )}
        </form>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fdfff7"
          }}>
            <thead>
              <tr style={{ background: "#f8f0ff" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Course Name</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Description</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} style={{
                    padding: "20px",
                    textAlign: "center"
                  }}>Loading...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#b5b6d5"
                  }}>
                    No courses are added yet.
                  </td>
                </tr>
              ) : courses.map(course => (
                <tr key={course.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{course.name}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{course.description}</td>
                  <td style={{
                    padding: "10px",
                    borderBottom: "1px solid #e9e7f5"
                  }}>
                    <button onClick={() => handleEdit(course)} style={{
                      marginRight: "13px",
                      padding: "7px 12px",
                      borderRadius: "7px",
                      border: "none",
                      background: "linear-gradient(90deg,#dbf9fa 80%, #87b9f8 100%)",
                      color: "#218749",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(course.id)} style={{
                      padding: "7px 12px",
                      borderRadius: "7px",
                      border: "none",
                      background: "#ebebed",
                      color: "#885d9e",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}>
                      Delete
                    </button>
                  </td>
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

export default AdminCourses;
