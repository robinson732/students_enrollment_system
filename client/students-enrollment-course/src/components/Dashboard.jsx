import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard({ students = [], courses = [], enrollments = [], setStudents }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", email: "" });

  const metrics = useMemo(() => ({
    totalStudents: students.length,
    totalCourses: courses.length,
    activeEnrollments: enrollments.length,
  }), [students.length, courses.length, enrollments.length]);

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students.slice(0, 6);
    return students.filter(s =>
      String(s.name ?? "").toLowerCase().includes(q) ||
      String(s.email ?? "").toLowerCase().includes(q)
    ).slice(0, 6);
  }, [students, query]);

  function getRowId(student, index) {
    return student.id ?? student.localId ?? index;
  }

  function beginEdit(student, index) {
    setEditingId(getRowId(student, index));
    setEditDraft({ name: student.name ?? "", email: student.email ?? "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ name: "", email: "" });
  }

  async function saveEdit(id) {
    const payload = { name: editDraft.name.trim(), email: editDraft.email.trim() };
    if (!payload.name || !payload.email) return;
    console.log("Saving edit for ID:", id, "Payload:", payload);
    const previous = students;
    const updated = students.map((s, i) => (getRowId(s, i) === id ? { ...s, ...payload } : s));
    setStudents(updated);
    setEditingId(null);
    try {
      const target = previous.find((s, i) => getRowId(s, i) === id);
      console.log("Target found:", target);
      if (target && target.id == null) return; // no backend id yet; local edit only
  const res = await fetch(`http://127.0.0.1:5000/students/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      console.log("API error, keeping local changes:", error);
       
    }
  }

  async function deleteStudent(id) {
    console.log("Deleting student with ID:", id);
    const previous = students;
    const target = previous.find((s, i) => getRowId(s, i) === id);
    console.log("Target to delete:", target);
    setStudents(students.filter((s, i) => getRowId(s, i) !== id));
    try {
      if (!target || target.id == null) return;  
  const res = await fetch(`http://127.0.0.1:5000/students/${target.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (error) {
      console.log("API error, keeping local changes:", error);
     
    }
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: 24 }}>Dashboard</h2>

      <section className="stats-container">
        <div className="card-kpi">
          <div className="kpi-value">{metrics.totalStudents}</div>
          <div className="kpi-label">Total Students</div>
        </div>
        <div className="card-kpi">
          <div className="kpi-value">{metrics.totalCourses}</div>
          <div className="kpi-label">Total Courses</div>
        </div>
        <div className="card-kpi">
          <div className="kpi-value">{metrics.activeEnrollments}</div>
          <div className="kpi-label">Active Enrollments</div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <h3 className="section-title">Students</h3>
          <div className="section-actions">
            <input
              className="search-input"
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Link to="/students"><button>Add Student</button></Link>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Enrollment Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => {
                const rowId = getRowId(s, i);
                return (
                  <tr key={rowId}>
                    <td>
                      {editingId === rowId ? (
                        <input 
                          value={editDraft.name} 
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} 
                        />
                      ) : (
                        s.name
                      )}
                    </td>
                    <td>
                      {editingId === rowId ? (
                        <input 
                          value={editDraft.email} 
                          onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })} 
                        />
                      ) : (
                        s.email
                      )}
                    </td>
                    <td><span className="badge badge-success">Active</span></td>
                    <td>
                      {editingId === rowId ? (
                        <>
                          <button type="button" onClick={() => saveEdit(rowId)}>Save</button>
                          <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => beginEdit(s, i)} className="btn-edit">Edit</button>
                          <button type="button" onClick={() => deleteStudent(rowId)} className="btn-delete">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="4">No matching students.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}