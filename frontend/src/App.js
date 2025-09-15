import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your pages here
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import CourseManager from "./pages/CourseManager";

// Role-based protection
const role = localStorage.getItem("role");

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // If token or role not yet set, don't render anything (wait a moment)
  if (token === null || role === null) {
    return null; // or a loading spinner
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes: only for admin role */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin-feedback" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminFeedback />
          </PrivateRoute>
        } />
        <Route path="/admin-students" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminStudents />
          </PrivateRoute>
        } />
        <Route path="/admin-courses" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminCourses />
          </PrivateRoute>
        } />

        {/* Student routes: only for student role */}
        <Route path="/student-dashboard" element={
          <PrivateRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </PrivateRoute>
        } />
        <Route path="/feedback" element={
          <PrivateRoute allowedRoles={["student"]}>
            <Feedback />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute allowedRoles={["student"]}>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/Course-Manager" element={
          <PrivateRoute allowedRoles={["student"]}>
            <CourseManager />
          </PrivateRoute>
        } />

        {/* Public routes (all roles) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Add more Route tags for extra pages */}
      </Routes>
    </Router>
  );
}

export default App;
