import CourseList from "../components/CourseList";

export default function CoursesPage({ courses, setCourses }) {
  return <CourseList courses={courses} setCourses={setCourses} />;
}
