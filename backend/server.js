const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const { Parser } = require("json2csv");
const path = require("path");

const SECRET = "myverysecretkey";
const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(DB_PATH);

// Tables setup
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'student',
      phone TEXT,
      dob TEXT,
      address TEXT,
      profilePic TEXT,
      blocked INTEGER DEFAULT 0
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER,
      courseId INTEGER,
      rating INTEGER,
      message TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(studentId) REFERENCES users(id),
      FOREIGN KEY(courseId) REFERENCES courses(id)
    )`
  );
});

// Middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  try {
    const token = auth.split(" ")[1];
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admins only" });
  next();
}

// Signup
app.post("/api/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing name/email/password" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email format" });
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password))
    return res.status(400).json({ error: "Password must be 8+ chars, 1 number, 1 special char" });
  db.run(
    `INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`,
    [name, email, bcrypt.hashSync(password, 10), role || "student"],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already exists" });
      res.json({ success: true });
    }
  );
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    if (user.blocked) return res.status(403).json({ error: "Blocked by admin" });
    if (!bcrypt.compareSync(password, user.password))
      return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token, role: user.role, name: user.name });
  });
});

// Profile endpoints
app.get("/api/profile", authMiddleware, (req, res) => {
  db.get(
    `SELECT name, email, phone, dob, address, profilePic FROM users WHERE id=?`,
    [req.user.id],
    (err, row) => {
      if (err || !row) return res.status(404).json({ error: "Profile not found" });
      res.json(row);
    }
  );
});

app.put("/api/profile", authMiddleware, (req, res) => {
  const { name, phone, dob, address, profilePic } = req.body;
  db.run(
    `UPDATE users SET name=?, phone=?, dob=?, address=?, profilePic=? WHERE id=?`,
    [name, phone, dob, address, profilePic, req.user.id],
    function (err) {
      if (err) return res.status(400).json({ error: "Update failed" });
      res.json({ success: true });
    }
  );
});

app.put("/api/change-password", authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  db.get(`SELECT password FROM users WHERE id=?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "User not found" });
    if (!bcrypt.compareSync(currentPassword, user.password))
      return res.status(400).json({ error: "Wrong current password" });
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword))
      return res.status(400).json({ error: "Password must be 8+ chars, 1 number, 1 special char" });
    db.run(
      `UPDATE users SET password=? WHERE id=?`,
      [bcrypt.hashSync(newPassword, 10), req.user.id],
      function (err) {
        if (err) return res.status(400).json({ error: "Update failed" });
        res.json({ success: true });
      }
    );
  });
});

// Courses endpoints
app.get("/api/courses", (req, res) => {
 db.all(
  `SELECT id, name, email, role, blocked FROM users WHERE role='student'`,
  [],
  (err, rows) => {
    console.log("ADMIN STUDENTS API: rows =", rows, "; err =", err);
    if (err) return res.status(400).json({ error: "Fetch failed" });
    res.json(rows);
  }
);


app.post("/api/courses", authMiddleware, adminMiddleware, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Course name required" });
  db.run(
    `INSERT INTO courses (name, description) VALUES (?, ?)`,
    [name, description || ""],
    function (err) {
      if (err) return res.status(400).json({ error: "Course exists or error" });
      res.json({ success: true });
    }
  );
});

app.put("/api/courses/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.run(
    `UPDATE courses SET name = ?, description = ? WHERE id = ?`,
    [req.body.name, req.body.description || "", req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: "Update failed" });
      res.json({ success: true });
    }
  );
});

app.delete("/api/courses/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.run(`DELETE FROM courses WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

// Feedback endpoints
app.post("/api/feedback", authMiddleware, (req, res) => {
  const { courseId, rating, message } = req.body;
  if (!courseId || !rating || !message || !message.trim()) {
    return res.status(400).json({ error: "All fields required" });
  }
  db.run(
    "INSERT INTO feedback (studentId, courseId, rating, message) VALUES (?, ?, ?, ?)",
    [req.user.id, courseId, rating, message],
    function (err) {
      if (err) return res.status(400).json({ error: err.message || "Feedback failed" });
      res.json({ success: true });
    }
  );
});

// Admin endpoints

// Students list
app.get("/api/admin/students", authMiddleware, adminMiddleware, (req, res) => {
  db.all(
    `SELECT id, name, email, role, blocked FROM users WHERE role='student'`,
    [],
    (err, rows) => {
       console.log("ADMIN STUDENTS API:", rows);
      if (err) return res.status(400).json({ error: "Fetch failed" });
      res.json(rows);
    }
  );
});

// Block student
app.put("/api/admin/block/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.run(`UPDATE users SET blocked=1 WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: "Action failed" });
    res.json({ success: true });
  });
});

// Unblock student
app.put("/api/admin/unblock/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.run(`UPDATE users SET blocked=0 WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: "Action failed" });
    res.json({ success: true });
  });
});

// Delete user
app.delete("/api/admin/delete/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.run(`DELETE FROM users WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

// Feedback list for admin
app.get("/api/admin/feedback", authMiddleware, adminMiddleware, (req, res) => {
  db.all(
    `SELECT f.*, u.name as studentName, c.name as courseName
     FROM feedback f
     JOIN users u ON f.studentId=u.id
     JOIN courses c ON f.courseId=c.id
     ORDER BY f.createdAt DESC`,
    [],
    (err, rows) => {
      console.log("ADMIN FEEDBACK API:", rows);
      if (err) return res.status(400).json({ error: "Fetch failed" });
      res.json(rows);
    }
  );
});

// Feedback analytics per course
app.get("/api/admin/feedback/analytics", authMiddleware, adminMiddleware, (req, res) => {
  db.all(
    `SELECT c.name as courseName, COUNT(f.id) as feedbackCount, AVG(f.rating) as avgRating
     FROM feedback f JOIN courses c ON f.courseId = c.id
     GROUP BY f.courseId`,
    [],
    (err, rows) => {
      if (err) return res.status(400).json({ error: "Analytics failed" });
      res.json(rows);
    }
  );
});

// Dashboard summary for admin: student/feedback count
app.get("/api/admin-dashboard", authMiddleware, adminMiddleware, (req, res) => {
  db.get(`SELECT COUNT(*) as studentCount FROM users WHERE role='student'`, [], (err, studentRow) => {
    if (err) return res.status(500).json({ error: "Student count failed" });
    db.get(`SELECT COUNT(*) as feedbackCount FROM feedback`, [], (err, feedbackRow) => {
      if (err) return res.status(500).json({ error: "Feedback count failed" });
      db.all(
        `SELECT c.name as courseName, ROUND(AVG(f.rating),2) as avgRating
         FROM feedback f JOIN courses c ON f.courseId = c.id
         GROUP BY f.courseId`,
        [],
        (err, avgRows) => {
          if (err) return res.status(500).json({ error: "Average ratings failed" });
          res.json({
            studentCount: studentRow.studentCount || 0,
            feedbackCount: feedbackRow.feedbackCount || 0,
            avgRatings: avgRows
          });
        }
      );
    });
  });
});

// Export feedback to CSV
app.get("/api/admin/feedback/export", authMiddleware, adminMiddleware, (req, res) => {
  db.all(
    `SELECT f.id, u.name as studentName, c.name as courseName, f.rating, f.message, f.createdAt
     FROM feedback f
     JOIN users u ON f.studentId=u.id
     JOIN courses c ON f.courseId=c.id
     ORDER BY f.createdAt DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(400).json({ error: "Export failed" });
      const parser = new Parser();
      const csv = parser.parse(rows);
      res.header("Content-Type", "text/csv");
      res.attachment("feedback.csv");
      res.send(csv);
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000, DB:", DB_PATH);
});}
)
