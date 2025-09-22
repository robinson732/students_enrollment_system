import { useState, useEffect } from "react";
import StudentList from "./components/StudentList";
import CourseList from "./components/CourseList";
import EnrollmentList from "./components/EnrollmentList";

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

   
  useEffect(() => {
    fetch("http://127.0.0.1:5000/students").then(r => r.json()).then(setStudents);
    fetch("http://127.0.0.1:5000/courses").then(r => r.json()).then(setCourses);
    fetch("http://127.0.0.1:5000/enrollments").then(r => r.json()).then(setEnrollments);
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
