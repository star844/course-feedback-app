import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchStudents();
    // eslint-disable-next-line
  }, [token, navigate]);

  const fetchStudents = () => {
    setLoading(true);
    axios
      .get(`${API}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  const handleBlockToggle = async (studentId, isBlocked) => {
    await axios.patch(
      `${API}/api/students/${studentId}/${isBlocked ? "unblock" : "block"}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchStudents();
  };

  const handleDelete = async studentId => {
    if (window.confirm("Delete this user?")) {
      await axios.delete(`${API}/api/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    }
  };

 

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #fcfedd 0%, #e7f4fd 100%)",
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
          color: "#b283c4",
          marginBottom: "18px"
        }}>
          Manage Students
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fdfff7"
          }}>
            <thead>
              <tr style={{ background: "#f8f0ff" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Name</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Email</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Status</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #e9e7f5" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{
                    padding: "20px",
                    textAlign: "center"
                  }}>Loading...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#b5b6d5"
                  }}>
                    No students registered.
                  </td>
                </tr>
              ) : students.map((stu) => (
                <tr key={stu.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{stu.name}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>{stu.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #e9e7f5" }}>
                    {stu.isBlocked ? (
                      <span style={{ color: "#e04747", fontWeight: "bold" }}>Blocked</span>
                    ) : (
                      <span style={{ color: "#44b574", fontWeight: "bold" }}>Active</span>
                    )}
                  </td>
                  <td style={{
                    padding: "10px",
                    borderBottom: "1px solid #e9e7f5"
                  }}>
                    <button onClick={() => handleBlockToggle(stu.id, stu.isBlocked)} style={{
                      marginRight: "13px",
                      padding: "7px 13px",
                      borderRadius: "7px",
                      border: "none",
                      background: stu.isBlocked
                        ? "linear-gradient(90deg,#b7dbfa 80%, #72de58 100%)"
                        : "linear-gradient(90deg,#fcc2d7 80%, #f7878d 100%)",
                      color: stu.isBlocked ? "#218749" : "#ac1446",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}>
                      {stu.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button onClick={() => handleDelete(stu.id)} style={{
                      padding: "7px 13px",
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

export default AdminStudents;
