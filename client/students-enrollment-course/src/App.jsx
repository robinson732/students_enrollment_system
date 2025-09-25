import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import DashboardPage from "./Pages/DashboardPage";
import StudentsPage from "./Pages/StudentsPage";
import CoursesPage from "./Pages/CoursesPage";
import EnrollmentsPage from "./Pages/EnrollmentsPage";

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/students")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStudents)
      .catch(() => setStudents([]));

    fetch("http://127.0.0.1:5000/courses")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setCourses)
      .catch(() => setCourses([]));

    fetch("http://127.0.0.1:5000/enrollments")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setEnrollments)
      .catch(() => setEnrollments([]));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "240px", background: "#0f172a", color: "#e2e8f0", padding: "20px" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Student Enrollment System</h2>
        <Navbar />
      </aside>
      <main style={{ flex: 1, padding: "24px" }}>
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage students={students} courses={courses} enrollments={enrollments} setStudents={setStudents} />} />
          <Route path="/students" element={<StudentsPage students={students} setStudents={setStudents} />} />
          <Route path="/courses" element={<CoursesPage courses={courses} setCourses={setCourses} />} />
          <Route path="/enrollments" element={<EnrollmentsPage enrollments={enrollments} students={students} courses={courses} setEnrollments={setEnrollments} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;