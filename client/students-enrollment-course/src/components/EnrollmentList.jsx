 import { useState } from "react";

function EnrollmentList({ enrollments, setEnrollments, students, courses }) {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ grade: "" });
  const [newEnrollment, setNewEnrollment] = useState({
    student_id: "",
    course_id: "",
    grade: "",
  });

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
          {students.map((s) => (
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
            <button onClick={() => handleEdit(e)}>✏️ Edit</button>
            <button onClick={() => handleDelete(e.id)}>🗑️ Delete</button>
          </div>
        )
      )}
    </div>
  );
}

export default EnrollmentList;
