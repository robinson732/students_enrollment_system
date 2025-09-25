import Dashboard from "../components/Dashboard";

export default function DashboardPage({ students = [], courses = [], enrollments = [], setStudents }) {
  return <Dashboard students={students} courses={courses} enrollments={enrollments} setStudents={setStudents} />;
}