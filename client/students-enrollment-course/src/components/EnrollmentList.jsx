import { useState } from "react";

export default function EnrollmentList({ enrollments, students, courses, setEnrollments }) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ student_id: "", course_id: "" });

  const studentIdToName = new Map((students ?? []).map((s) => [String(s.id ?? s.name), s.name]));
  const courseIdToTitle = new Map((courses ?? []).map((c) => [String(c.id ?? c.title), c.title]));

  async function handleAddEnrollment(event) {
    event.preventDefault();
    setErrorMessage("");
    if (!studentId || !courseId) {
      setErrorMessage("Select both a student and a course.");
      return;
    }
    const newEnrollment = { student_id: Number(studentId), course_id: Number(courseId) };
    setSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEnrollment),
      });
      if (!response.ok) throw new Error("Failed to create enrollment");
      const created = await response.json();
      setEnrollments([...enrollments, created]);
      setStudentId("");
      setCourseId("");
    } catch (error) {
      console.log("API error, adding locally:", error);
      const optimistic = {
        id: Date.now(),
        student_id: Number(studentId),
        course_id: Number(courseId),
        timestamp: Date.now()
      };
      console.log("Adding new enrollment:", optimistic);
      console.log("Current enrollments before:", enrollments);
      const newEnrollments = [...enrollments, optimistic];
      console.log("New enrollments array:", newEnrollments);
      setEnrollments(newEnrollments);
      setStudentId("");
      setCourseId("");
    } finally {
      setSubmitting(false);
    }
  }

  function getRowId(enrollment, index) {
    return enrollment.id ?? enrollment.timestamp ?? `temp-${index}`;
  }

  function beginEdit(enrollment, index) {
    setEditingId(getRowId(enrollment, index));
    setEditDraft({
      student_id: String(enrollment.student_id ?? ""),
      course_id: String(enrollment.course_id ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ student_id: "", course_id: "" });
  }

  async function saveEdit(id) {
    const payload = { student_id: Number(editDraft.student_id), course_id: Number(editDraft.course_id) };
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
      // Keep the local changes since API is not available
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
      // Keep the local changes since API is not available
    }
  }

  return (
    <section style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Enrollments</h2>
        <form onSubmit={handleAddEnrollment} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Select student</option>
            {(students ?? []).map((s) => (
              <option key={s.id ?? s.name} value={s.id ?? s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">Select course</option>
            {(courses ?? []).map((c) => (
              <option key={c.id ?? c.title} value={c.id ?? c.title}>
                {c.title}
              </option>
            ))}
          </select>
          <button type="submit" disabled={submitting || (students ?? []).length === 0 || (courses ?? []).length === 0}>
            {submitting ? "Adding..." : "Add Enrollment"}
          </button>
        </form>
      </div>
      {errorMessage ? <p style={{ color: "crimson" }}>{errorMessage}</p> : null}
      {enrollments && enrollments.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enr, index) => {
                const rowId = getRowId(enr, index);
                console.log("Rendering enrollment:", enr, "at index:", index, "with rowId:", rowId);
                return (
                <tr key={rowId} style={{ border: '1px solid #333' }}>
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
              )})}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No enrollments yet.</p>
      )}
    </section>
  );
}


