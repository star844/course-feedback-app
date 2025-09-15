# Course Feedback App

A full-stack web application that allows students to submit course feedback and enables administrators to manage users, courses, and analyze feedback.

---

## Features

- Secure signup/login for students and admins (using JWT and bcrypt)
- Admin dashboard showing total feedback, student counts, and average course ratings
- CRUD operations for courses (admin only)
- Manage students (block/unblock, delete)
- Submit and view feedbacks; CSV export of feedback (admin)
- SQLite database backend for simplicity and portability

---

## Project Structure

- `/backend` — Node.js + Express server with SQLite database
- `/frontend` — React app with student and admin views
- `database.db` — SQLite database file (created automatically if missing)
- `README.md` — This documentation

---

## Setup Instructions

### Backend

1. Open terminal and navigate to `/backend` folder:
cd backend
2. Install dependencies:
npm install
3. Start the server:
node server.js
4. The server runs at `http://localhost:5000`

### Frontend

1. Open a new terminal window/tab and go to your frontend folder:
cd frontend
2. Install dependencies:
npm install
3. Start the React development server:
npm start
4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Demo Instructions

- Register users as student and admin
- Admin login redirects to dashboard showing feedback and student stats
- Manage students: block/unblock and delete users
- Manage courses: add, update, delete courses
- Submit feedback as a student and view it as admin
- Export feedback as CSV from admin panel

---

## Sample Credentials for Demo

| Role   | Email             | Password    |
|--------|-------------------|-------------|
| Admin  | admin@example.com | Admin@123   |
| Student| user@example.com  | Student@123 |

(Or create your own via signup)

---

## Screenshots

*(Include screenshots of key features like Dashboard, Manage Students, Feedback List, Course Management)*

---

## Additional Notes

- The SQLite database auto-creates if not present.
- Passwords must contain at least 8 characters, including a number and special character.
- JWT tokens expire after 2 hours for security.
- Frontend and backend communicate via REST API on ports 3000 and 5000 respectively.

---

## Contact

For questions or issues, please contact:

[Your Name]  
[Your email]

---

## License

This project is licensed under the MIT License.
