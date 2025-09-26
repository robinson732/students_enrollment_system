import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function EnrollmentList({ enrollments, students, courses, setEnrollments }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ student_id: "", course_id: "", grade: "" });

  const studentIdToName = new Map((students ?? []).map((s) => [String(s.id ?? s.name), s.name]));
  const courseIdToTitle = new Map((courses ?? []).map((c) => [String(c.id ?? c.title), c.title]));

  const validationSchema = Yup.object({
    student_id: Yup.number().typeError("Select a student").required("Required").positive().integer(),
    course_id: Yup.number().typeError("Select a course").required("Required").positive().integer(),
    grade: Yup.string()
      .oneOf(["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"], "Invalid grade")
      .optional(),
  });

  function getRowId(enrollment, index) {
    return enrollment.id ?? enrollment.timestamp ?? `temp-${index}`;
  }

  function beginEdit(enrollment, index) {
    setEditingId(getRowId(enrollment, index));
    setEditDraft({
      student_id: String(enrollment.student_id ?? ""),
      course_id: String(enrollment.course_id ?? ""),
      grade: String(enrollment.grade ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ student_id: "", course_id: "", grade: "" });
  }

  async function saveEdit(id) {
    const payload = { student_id: Number(editDraft.student_id), course_id: Number(editDraft.course_id), grade: editDraft.grade || null };
    if (!payload.student_id || !payload.course_id) return;
    console.log("Saving enrollment edit for ID:", id, "Payload:", payload);
    const previous = enrollments;
    const updated = enrollments.map((e, i) => (getRowId(e, i) === id ? { ...e, ...payload } : e));
    setEnrollments(updated);
    setEditingId(null);
    try {
      const target = previous.find((e, i) => getRowId(e, i) === id);
      if (target && target.id == null) return;
      const res = await fetch(`http://127.0.0.1:5000/enrollments/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      console.log("API error, keeping local changes:", error);
     
    }
  }

  async function deleteEnrollment(id) {
    console.log("Deleting enrollment with ID:", id);
    const previous = enrollments;
    const target = previous.find((e, i) => getRowId(e, i) === id);
    console.log("Target to delete:", target);
    setEnrollments(enrollments.filter((e, i) => getRowId(e, i) !== id));
    try {
      if (!target || target.id == null) return;
      const res = await fetch(`http://127.0.0.1:5000/enrollments/${target.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (error) {
      console.log("API error, keeping local changes:", error);
       
    }
  }

  return (
    <section>
      <div className="section-header">
        <h3 className="section-title">Enrollments</h3>
        <div className="section-actions">
          <Formik
            initialValues={{ student_id: "", course_id: "", grade: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              setErrorMessage("");
              setSubmitting(true);
              const newEnrollment = { student_id: Number(values.student_id), course_id: Number(values.course_id), grade: values.grade || null };
              try {
                const response = await fetch("http://127.0.0.1:5000/enrollments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newEnrollment),
                });
                if (!response.ok) throw new Error("Failed to create enrollment");
                const created = await response.json();
                setEnrollments([...enrollments, created]);
                resetForm();
              } catch {
                const optimistic = { id: Date.now(), ...newEnrollment, timestamp: Date.now() };
                setEnrollments([...enrollments, optimistic]);
                resetForm();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Form style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <div>
                <Field as="select" name="student_id">
                  <option value="">Select student</option>
                  {(students ?? []).map((s) => (
                    <option key={s.id ?? s.name} value={s.id ?? s.name}>{s.name}</option>
                  ))}
                </Field>
                <div className="field-error"><ErrorMessage name="student_id" /></div>
              </div>
              <div>
                <Field as="select" name="course_id">
                  <option value="">Select course</option>
                  {(courses ?? []).map((c) => (
                    <option key={c.id ?? c.title} value={c.id ?? c.title}>{c.title}</option>
                  ))}
                </Field>
                <div className="field-error"><ErrorMessage name="course_id" /></div>
              </div>
              <div>
                <Field as="select" name="grade">
                  <option value="">Grade (optional)</option>
                  { ["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Field>
                <div className="field-error"><ErrorMessage name="grade" /></div>
              </div>
              <button type="submit" disabled={submitting || (students ?? []).length === 0 || (courses ?? []).length === 0}>{submitting ? "Adding..." : "Add Enrollment"}</button>
            </Form>
          </Formik>
        </div>
      </div>
      {errorMessage ? <p style={{ color: "crimson" }}>{errorMessage}</p> : null}
      {enrollments && enrollments.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enr, index) => {
                const rowId = getRowId(enr, index);
                console.log("Rendering enrollment:", enr, "at index:", index, "with rowId:", rowId);
                return (
                  <tr key={rowId}>
                    <td>
                      {editingId === rowId ? (
                        <select value={editDraft.student_id} onChange={(e) => setEditDraft({ ...editDraft, student_id: e.target.value })}>
                          {(students ?? []).map((s) => (
                            <option key={s.id ?? s.name} value={s.id ?? s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        studentIdToName.get(String(enr.student_id)) ?? enr.student_id
                      )}
                    </td>
                    <td>
                      {editingId === rowId ? (
                        <select value={editDraft.course_id} onChange={(e) => setEditDraft({ ...editDraft, course_id: e.target.value })}>
                          {(courses ?? []).map((c) => (
                            <option key={c.id ?? c.title} value={c.id ?? c.title}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        courseIdToTitle.get(String(enr.course_id)) ?? enr.course_id
                      )}
                    </td>
                    <td>
                      {editingId === rowId ? (
                        <select value={editDraft.grade} onChange={(e) => setEditDraft({ ...editDraft, grade: e.target.value })}>
                          <option value="">Grade (optional)</option>
                          {["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      ) : (
                        enr.grade ?? "-"
                      )}
                    </td>
                    <td>
                      {editingId === rowId ? (
                        <>
                          <button onClick={() => saveEdit(rowId)}>Save</button>
                          <button onClick={cancelEdit} className="btn-secondary">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => beginEdit(enr, index)}>Edit</button>
                          <button onClick={() => deleteEnrollment(rowId)} className="btn-danger">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No enrollments yet.</p>
      )}
    </section>
  );
}