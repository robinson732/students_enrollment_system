import StudentList from "../components/StudentList";

export default function StudentsPage({ students, setStudents }) {
  return <StudentList students={students} setStudents={setStudents} />;
}
