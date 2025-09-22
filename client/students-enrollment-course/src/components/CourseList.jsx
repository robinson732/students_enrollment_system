// src/components/CourseList.jsx

import React, { useEffect, useState } from 'react';
import Enrollment from './Enrollment';  // component to show enrollments per course (see below)

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const resp = await fetch('/api/courses'); // adjust URL
        if (!resp.ok) throw new Error('Failed to fetch courses');
        const data = await resp.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const resp = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error('Failed to delete');
      // remove from list
      setCourses(courses.filter(c => c.id !== courseId));
      // if that was selected, clear it
      if (selectedCourseId === courseId) {
        setSelectedCourseId(null);
      }
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.code} — {course.name}&nbsp;
            <button onClick={() => handleSelectCourse(course.id)}>View Enrollments</button>
            <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedCourseId && (
        <Enrollment courseId={selectedCourseId} />
      )}
    </div>
  );
}

export default CourseList;
