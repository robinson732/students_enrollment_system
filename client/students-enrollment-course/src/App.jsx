import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import DashboardPage from "./Pages/DashboardPage";
import StudentsPage from "./Pages/StudentsPage";
import CoursesPage from "./Pages/CoursesPage";
import EnrollmentsPage from "./Pages/EnrollmentsPage";
import { apiGet } from "./lib/api";

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    apiGet('/students').then(setStudents).catch(() => setStudents([]));
    apiGet('/courses').then(setCourses).catch(() => setCourses([]));
    apiGet('/enrollments').then(setEnrollments).catch(() => setEnrollments([]));
  }, []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 style={{ marginTop: 0, fontSize: "1.1rem", fontWeight: "600" }}>Student Enrollment System</h2>
        <Navbar />
      </aside>
      <main className="main-content">
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