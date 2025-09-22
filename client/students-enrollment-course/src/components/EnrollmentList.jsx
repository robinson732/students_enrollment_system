// src/components/Enrollment.jsx

import React, { useEffect, useState } from 'react';

function Enrollment({ courseId }) {
  const [students, setStudents] = useState([]);  // all students
  const [enrolled, setEnrolled] = useState([]);  // studentIds enrolled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // fetch all students
        const [resp1, resp2] = await Promise.all([
          fetch('/api/students'),
          fetch(`/api/courses/${courseId}/enrollments`)
        ]);
        if (!resp1.ok) throw new Error('Failed to fetch students');
        if (!resp2.ok) throw new Error('Failed to fetch enrollments');
        const dataStudents = await resp1.json();
        const dataEnroll = await resp2.json();
        setStudents(dataStudents);
        // dataEnroll might be an array of objects like { id, studentId, courseId }
        setEnrolled(dataEnroll.map(e => e.studentId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  const toggleEnroll = async (studentId) => {
    if (enrolled.includes(studentId)) {
      // un-enroll
      try {
        const resp = await fetch(`/api/enrollments/${courseId}/student/${studentId}`, {
          method: 'DELETE'
        });
        if (!resp.ok) throw new Error('Failed to unenroll');
        setEnrolled(enrolled.filter(id => id !== studentId));
      } catch (err) {
        alert('Error: ' + err.message);
      }
    } else {
      // enroll
      try {
        const resp = await fetch(`/api/enrollments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId, studentId })
        });
        if (!resp.ok) throw new Error('Failed to enroll');
        const newEnrollment = await resp.json();  // if needed
        setEnrolled([...enrolled, studentId]);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading enrollment data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Enrollment for Course {courseId}</h3>
      <ul>
        {students.map(s => (
          <li key={s.id}>
            <label>
              <input
                type="checkbox"
                checked={enrolled.includes(s.id)}
                onChange={() => toggleEnroll(s.id)}
              />
              {s.name} ({s.email})
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Enrollment;
