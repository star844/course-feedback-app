import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PROFILE_EMOJI = "👤";
const SAVE_EMOJI = "💾";
const PASSWORD_EMOJI = "🔑";

const API = "http://localhost:5000";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    profilePic: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProfile(res.data))
      .catch(() => setError("")); // No "Profile not found" error
  }, [token]);

  const handleInput = e =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleProfileUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Profile updated!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
      setSuccess("");
    }
  };

  const [pwFields, setPwFields] = useState({ currentPassword: "", newPassword: "" });

  const handlePwInput = e =>
    setPwFields({ ...pwFields, [e.target.name]: e.target.value });

  const handlePasswordChange = async e => {
    e.preventDefault();
    if (!pwFields.currentPassword || !pwFields.newPassword) {
      setError("Enter both current and new password.");
      return;
    }
    try {
      await axios.put(`${API}/api/change-password`, pwFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Password changed!");
      setError("");
      setPwFields({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
      setSuccess("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #D8F1FF 0%, #FFD6F8 100%)",
      paddingTop: "40px"
    }}>
      <div className="container" style={{
        background: "rgba(255,255,255,0.96)",
        borderRadius: "20px",
        boxShadow: "0 8px 28px rgba(80,120,190,0.12)",
        maxWidth: "620px",
        margin: "auto",
        padding: "34px 46px"
      }}>
        <h2 style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2.08rem",
          letterSpacing: "0.01em",
          color: "#234567"
        }}>{PROFILE_EMOJI} My Profile</h2>
        
        {/* Profile Edit Card */}
        <div style={{
          background: "linear-gradient(90deg, #eaf5ff 0%, #ffe6fc 100%)",
          border: "1.5px solid #e4e9f2",
          borderRadius: "15px",
          padding: "22px 28px",
          boxShadow: "0 2px 18px rgba(148,173,255,0.07)",
          marginBottom: "32px"
        }}>
          <form onSubmit={handleProfileUpdate} style={{
            display: "grid",
            gap: "13px"
          }}>
            <input
              name="name"
              value={profile.name}
              onChange={handleInput}
              placeholder="Name"
              required
              style={{
                fontSize: "1.12rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <input
              name="email"
              value={profile.email}
              placeholder="Email"
              style={{
                fontSize: "1.10rem",
                color: profile.email ? "#454545" : "#b2b2b2",
                borderRadius: "8px",
                border: "1.5px solid #d5d5de",
                padding: "9px 13px",
                fontStyle: profile.email ? "normal" : "italic"
              }}
              readOnly
            />
            <input
              name="phone"
              value={profile.phone}
              onChange={handleInput}
              placeholder="Phone"
              style={{
                fontSize: "1.12rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <input
              name="dob"
              type="date"
              value={profile.dob}
              onChange={handleInput}
              style={{
                fontSize: "1.08rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <input
              name="address"
              value={profile.address}
              onChange={handleInput}
              placeholder="Address"
              style={{
                fontSize: "1.12rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <input
              name="profilePic"
              value={profile.profilePic}
              onChange={handleInput}
              placeholder="Profile picture URL"
              style={{
                fontSize: "1.10rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <button type="submit" style={{
              marginTop: "9px",
              background: "linear-gradient(90deg, #89f5dd 60%, #a489ff 100%)",
              color: "#234567",
              fontWeight: 700,
              fontSize: "1.12rem",
              borderRadius: "8px",
              border: "none",
              padding: "12px 0"
            }}>
              {SAVE_EMOJI} Update Profile
            </button>
            {(error && error !== "Profile not found") && (
              <div style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.10rem",
                color: "#e04747",
                marginTop: "5px"
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.10rem",
                color: "#20af48",
                marginTop: "5px"
              }}>
                {success}
              </div>
            )}
          </form>
        </div>

        {/* Change Password Card */}
        <div style={{
          background: "linear-gradient(90deg, #f9fdff 0%, #ffe6fc 100%)",
          border: "1.5px solid #e4e9f2",
          borderRadius: "14px",
          padding: "22px 28px",
          marginBottom: "23px"
        }}>
          <h3 style={{
            color: "#6947b5",
            fontWeight: 700,
            fontSize: "1.23rem",
            textAlign: "center",
            marginBottom: "13px"
          }}>{PASSWORD_EMOJI} Change Password</h3>
          <form onSubmit={handlePasswordChange} style={{
            display: "flex",
            flexDirection: "column",
            gap: "11px"
          }}>
            <input
              name="currentPassword"
              value={pwFields.currentPassword}
              onChange={handlePwInput}
              placeholder="Current Password"
              type="password"
              required
              style={{
                fontSize: "1.11rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <input
              name="newPassword"
              value={pwFields.newPassword}
              onChange={handlePwInput}
              placeholder="New Password"
              type="password"
              required
              style={{
                fontSize: "1.11rem",
                borderRadius: "8px",
                border: "1.5px solid #c0d0e8",
                padding: "9px 13px"
              }}
            />
            <button type="submit" style={{
              marginTop: "7px",
              background: "linear-gradient(90deg, #a489ff 28%, #89f5dd 100%)",
              color: "#234567",
              fontWeight: 700,
              fontSize: "1.08rem",
              borderRadius: "8px",
              border: "none",
              padding: "11px 0"
            }}>
              {SAVE_EMOJI} Change Password
            </button>
            {(error && error !== "Profile not found") && (
              <div style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.10rem",
                color: "#e04747",
                marginTop: "5px"
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.10rem",
                color: "#20af48",
                marginTop: "5px"
              }}>
                {success}
              </div>
            )}
          </form>
        </div>

        {/* Back to Profile button */}
        <div style={{ marginTop: "22px", textAlign: "center" }}>
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

export default Profile;
