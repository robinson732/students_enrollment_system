import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function StudentList({ students, setStudents }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", email: "" });

  const validationSchema = Yup.object({
    name: Yup.string().trim().min(1, "Required").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

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
    const previous = students;
    const updated = students.map((s, i) => (getRowId(s, i) === id ? { ...s, ...payload } : s));
    setStudents(updated);
    setEditingId(null);
    try {
      const target = students.find((s, i) => getRowId(s, i) === id);
      if (target && target.id == null) return; // no backend id yet; local edit only
  const res = await fetch(`http://127.0.0.1:5000/students/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch {
      setStudents(previous);
    }
  }

  async function deleteStudent(id) {
    const previous = students;
    setStudents(students.filter((s, i) => getRowId(s, i) !== id));
    try {
      const target = previous.find((s, i) => getRowId(s, i) === id);
      if (!target || target.id == null) return; // local only
  const res = await fetch(`http://127.0.0.1:5000/students/${target.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      setStudents(previous);
    }
  }

  return (
    <section style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Students</h2>
        <Formik
          initialValues={{ name: "", email: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setErrorMessage("");
            setSubmitting(true);
            const newStudent = { name: values.name.trim(), email: values.email.trim() };
            try {
              const response = await fetch("http://127.0.0.1:5000/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStudent),
              });
              if (!response.ok) throw new Error("Failed to create student");
              const created = await response.json();
              setStudents([...students, { status: "Active", ...created }]);
              resetForm();
            } catch {
              const optimistic = { localId: Date.now(), status: "Active", ...newStudent };
              setStudents([...students, optimistic]);
              resetForm();
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <div>
              <Field name="name" type="text" placeholder="Student name" />
              <div className="field-error"><ErrorMessage name="name" /></div>
            </div>
            <div>
              <Field name="email" type="email" placeholder="Email" />
              <div className="field-error"><ErrorMessage name="email" /></div>
            </div>
            <button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Student"}</button>
          </Form>
        </Formik>
      </div>
      {errorMessage ? <p style={{ color: "crimson" }}>{errorMessage}</p> : null}
      {students && students.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const rowId = getRowId(student, index);
                return (
                <tr key={rowId}>
                  <td>
                    {editingId === rowId ? (
                      <input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td>
                    {editingId === rowId ? (
                      <input value={editDraft.email} onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })} />
                    ) : (
                      student.email
                    )}
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    {editingId === rowId ? (
                      <>
                        <button type="button" onClick={() => saveEdit(rowId)}>Save</button>
                        <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => beginEdit(student, index)}>Edit</button>
                        <button type="button" onClick={() => deleteStudent(rowId)} className="btn-danger">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students yet.</p>
      )}
    </section>
  );
}