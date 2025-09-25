import EnrollmentList from "../components/EnrollmentList";

export default function EnrollmentsPage({ enrollments, students, courses, setEnrollments }) {
  return (
    <EnrollmentList
      enrollments={enrollments}
      students={students}
      courses={courses}
      setEnrollments={setEnrollments}
    />
  );
}