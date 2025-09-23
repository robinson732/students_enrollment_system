import { useState } from "react";

function StudentList({ students, setStudents }) {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  // Start editing a student
  const handleEdit = (student) => {
    setEditing(student.id);
    setFormData({ name: student.name, email: student.email });
  };

  // Update student
  const handleUpdate = (id) => {
    setStudents(
      students.map((s) => (s.id === id ? { id, ...formData } : s))
    );
    setEditing(null);
  };

  // Delete student
  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  // Add new student
  const handleAdd = () => {
    if (!newStudent.name || !newStudent.email) return; // avoid empty
    const newId = students.length ? students[students.length - 1].id + 1 : 1;
    const created = { id: newId, ...newStudent };
    setStudents([...students, created]);
    setNewStudent({ name: "", email: "" });
  };

  return (
    <div>
      <h2>👩‍🎓 Students</h2>

      {/* Add Student Form */}
      <div>
        <input
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
        />
        <input
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      {/* List of Students */}
      {students.map((s) =>
        editing === s.id ? (
          <div key={s.id}>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <button onClick={() => handleUpdate(s.id)}>💾 Save</button>
            <button onClick={() => setEditing(null)}>❌ Cancel</button>
          </div>
        ) : (
          <div key={s.id}>
            {s.name} - {s.email}
            <button onClick={() => handleEdit(s)}>✏ Edit</button>
            <button onClick={() => handleDelete(s.id)}>🗑 Delete</button>
          </div>
        )
      )}
    </div>
  );
}

export default StudentList;
