 import { useState } from "react";

function CourseList({ courses, setCourses }) {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: "", instructor: "" });
  const [newCourse, setNewCourse] = useState({ title: "", instructor: "" });

  // Start editing
  const handleEdit = (course) => {
    setEditing(course.id);
    setFormData({ title: course.title, instructor: course.instructor });
  };

  // Update course
  const handleUpdate = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updated = await res.json();
      setCourses(courses.map((c) => (c.id === id ? updated : c)));
      setEditing(null);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/courses/${id}`, { method: "DELETE" });
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Add course
  const handleAdd = async () => {
    const res = await fetch("http://127.0.0.1:5000/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    });

    if (res.ok) {
      const created = await res.json();
      setCourses([...courses, created]);
      setNewCourse({ title: "", instructor: "" });
    }
  };

  return (
    <div>
      <h2>📘 Courses</h2>

      {/* Add Course Form */}
      <div>
        <input
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse({ ...newCourse, title: e.target.value })
          }
        />
        <input
          placeholder="Instructor"
          value={newCourse.instructor}
          onChange={(e) =>
            setNewCourse({ ...newCourse, instructor: e.target.value })
          }
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      {/* List Courses */}
      {courses.map((c) =>
        editing === c.id ? (
          <div key={c.id}>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              value={formData.instructor}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
            />
            <button onClick={() => handleUpdate(c.id)}>💾 Save</button>
            <button onClick={() => setEditing(null)}>❌ Cancel</button>
          </div>
        ) : (
          <div key={c.id}>
            {c.title} - {c.instructor}
            <button onClick={() => handleEdit(c)}>✏ Edit</button>
            <button onClick={() => handleDelete(c.id)}>🗑 Delete</button>
          </div>
        )
      )}
    </div>
  );
}

export default CourseList;
