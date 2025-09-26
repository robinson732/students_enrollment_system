import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiPost, apiPut, apiDelete } from "../lib/api";

export default function CourseList({ courses, setCourses }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", instructor: "" });

  const validationSchema = Yup.object({
    title: Yup.string().trim().min(1, "Required").required("Required"),
    instructor: Yup.string().trim().min(2, "Too short").required("Required"),
  });

  function getRowId(course, index) {
    return course.id ?? course.localId ?? index;
  }

  function beginEdit(course, index) {
    setEditingId(getRowId(course, index));
    setEditDraft({
      title: course.title ?? "",
      instructor: course.instructor ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ title: "", instructor: "" });
  }

  async function saveEdit(id) {
    setErrorMessage("");
    const payload = {
      title: editDraft.title.trim(),
      instructor: editDraft.instructor.trim(),
    };
    if (!payload.title || !payload.instructor) {
      setErrorMessage("Title and instructor cannot be empty.");
      return;
    }
    const updated = courses.map((c, i) =>
      getRowId(c, i) === id ? { ...c, ...payload } : c
    );
    setCourses(updated);
    setEditingId(null);
    try {
      const target = courses.find((c, i) => getRowId(c, i) === id);
      if (target && target.id == null) return; // optimistic only
      await apiPut(`/courses/${target.id}`, payload);
    } catch (error) {
      setErrorMessage(error.message || "Saved locally. Backend update failed.");
      // keep local optimistic update
    }
  }

  async function deleteCourse(id) {
    setErrorMessage("");
    const previous = courses;
    setCourses(courses.filter((c, i) => getRowId(c, i) !== id));
    try {
      const target = previous.find((c, i) => getRowId(c, i) === id);
      if (!target || target.id == null) return; // optimistic only
      await apiDelete(`/courses/${target.id}`);
    } catch (error) {
      setErrorMessage(error.message || "Deleted locally. Backend delete failed.");
      // keep local optimistic delete
    }
  }

  return (
    <section style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Courses</h2>
        <Formik
          initialValues={{ title: "", instructor: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setErrorMessage("");
            setSubmitting(true);
            const newCourse = { title: values.title.trim(), instructor: values.instructor.trim() };
            try {
              const created = await apiPost('/courses', newCourse);
              setCourses([...courses, created]);
              resetForm();
            } catch {
              const optimistic = { localId: Date.now(), ...newCourse };
              setCourses([...courses, optimistic]);
              resetForm();
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <div>
              <Field name="title" type="text" placeholder="Course title" />
              <div className="field-error"><ErrorMessage name="title" /></div>
            </div>
            <div>
              <Field name="instructor" type="text" placeholder="Instructor" />
              <div className="field-error"><ErrorMessage name="instructor" /></div>
            </div>
            <button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Course"}</button>
          </Form>
        </Formik>
      </div>
      {errorMessage ? <p style={{ color: "crimson" }}>{errorMessage}</p> : null}
      {courses && courses.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => {
                const rowId = getRowId(course, index);
                return (
                  <tr key={rowId}>
                    <td>
                      {editingId === rowId ? (
                        <input
                          value={editDraft.title}
                          onChange={(e) =>
                            setEditDraft({
                              ...editDraft,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        course.title
                      )}
                    </td>
                    <td>
                      {editingId === rowId ? (
                        <input
                          value={editDraft.instructor}
                          onChange={(e) =>
                            setEditDraft({
                              ...editDraft,
                              instructor: e.target.value,
                            })
                          }
                        />
                      ) : (
                        course.instructor
                      )}
                    </td>
                    <td>
                      {editingId === rowId ? (
                        <>
                          <button onClick={() => saveEdit(rowId)}>Save</button>
                          <button
                            onClick={cancelEdit}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => beginEdit(course, index)}>
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCourse(rowId)}
                            className="btn-danger"
                          >
                            Delete
                          </button>
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
        <p>No courses yet.</p>
      )}
    </section>
  );
}