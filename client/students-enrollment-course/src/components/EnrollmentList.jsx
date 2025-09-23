import { useState, useEffect } from "react";

// Mock data for frontend testing
const MOCK_STUDENTS = [
  { id: 1, name: "Alice Smith", email: "alice@example.com" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com" },
  { id: 3, name: "Charlie Lee", email: "charlie@example.com" },
];

function EnrollmentList({ enrollments, setEnrollments, students, courses }) {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ grade: "" });
  const [newEnrollment, setNewEnrollment] = useState({
    student_id: "",
    course_id: "",
    grade: "",
  });
  const [allStudents, setAllStudents] = useState([]); // all students
  const [enrolled, setEnrolled] = useState([]); // studentIds enrolled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API fetch with mock data
  useEffect(() => {
    setTimeout(() => {
      setAllStudents(MOCK_STUDENTS);
      setEnrolled([]); // No one enrolled initially
      setLoading(false);
    }, 500);
  }, []);

  // ---------------- ADD ----------------
  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:5000/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEnrollment),
    });

    if (res.ok) {
      const created = await res.json();
      setEnrollments([...enrollments, created]);
      setNewEnrollment({ student_id: "", course_id: "", grade: "" }); // reset form
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (enrollment) => {
    setEditing(enrollment.id);
    setFormData({ grade: enrollment.grade || "" });
  };

  const handleUpdate = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updated = await res.json();
      setEnrollments(enrollments.map((e) => (e.id === id ? updated : e)));
      setEditing(null);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/enrollments/${id}`, { method: "DELETE" });
    setEnrollments(enrollments.filter((e) => e.id !== id));
  };

  const toggleEnroll = (studentId) => {
    if (enrolled.includes(studentId)) {
      // Un-enroll
      setEnrolled(enrolled.filter((id) => id !== studentId));
    } else {
      // Enroll
      setEnrolled([...enrolled, studentId]);
    }
  };

  if (loading) return <div>Loading enrollment data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>📝 Enrollments</h2>

      {/* ADD FORM */}
      <form onSubmit={handleAdd}>
        <select
          value={newEnrollment.student_id}
          onChange={(e) =>
            setNewEnrollment({ ...newEnrollment, student_id: e.target.value })
          }
        >
          <option value="">Select Student</option>
          {allStudents.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={newEnrollment.course_id}
          onChange={(e) =>
            setNewEnrollment({ ...newEnrollment, course_id: e.target.value })
          }
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          placeholder="Grade"
          value={newEnrollment.grade}
          onChange={(e) =>
            setNewEnrollment({ ...newEnrollment, grade: e.target.value })
          }
        />
        <button type="submit">➕ Enroll</button>
      </form>

      {/* LIST */}
      {enrollments.map((e) =>
        editing === e.id ? (
          <div key={e.id}>
            <input
              value={formData.grade}
              onChange={(ev) =>
                setFormData({ ...formData, grade: ev.target.value })
              }
              placeholder="Grade"
            />
            <button onClick={() => handleUpdate(e.id)}>💾 Save</button>
            <button onClick={() => setEditing(null)}>❌ Cancel</button>
          </div>
        ) : (
          <div key={e.id}>
            Student {e.student_id} → Course {e.course_id} (Grade: {e.grade})
            <button onClick={() => handleEdit(e)}>✏ Edit</button>
            <button onClick={() => handleDelete(e.id)}>🗑 Delete</button>
          </div>
        )
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>Enrollment for Course {courseId}</h3>
        <ul>
          {allStudents.map((s) => (
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
    </div>
  );
}

export default EnrollmentList;