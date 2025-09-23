import { useState, useEffect } from "react";
import StudentList from "./components/StudentList.jsx";
import CourseList from "./components/CourseList.jsx";
import EnrollmentList from "./components/EnrollmentList.jsx";
function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch("/api/students")
      .then(r => r.ok ? r.json() : Promise.reject("Failed to fetch students"))
      .then(setStudents)
      .catch(() => setStudents([]));
    fetch("/api/courses")
      .then(r => r.ok ? r.json() : Promise.reject("Failed to fetch courses"))
      .then(setCourses)
      .catch(() => setCourses([]));
    fetch("/api/enrollments")
      .then(r => r.ok ? r.json() : Promise.reject("Failed to fetch enrollments"))
      .then(setEnrollments)
      .catch(() => setEnrollments([]));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Student Course Enrollment</h1>
      <StudentList students={students} setStudents={setStudents} />
      <CourseList courses={courses} setCourses={setCourses} />
      <EnrollmentList enrollments={enrollments} students={students} courses={courses} setEnrollments={setEnrollments} />
    </div>
  );
}

export default App;
