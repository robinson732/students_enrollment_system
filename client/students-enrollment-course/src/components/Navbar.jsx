import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 12px",
    borderRadius: "6px",
    color: isActive ? "#0f172a" : "#e2e8f0",
    background: isActive ? "#38bdf8" : "transparent",
    marginBottom: "6px",
  });

  return (
    <nav>
      <NavLink to="/" style={linkStyle} end>
        <span style={{ marginRight: 8 }}>📊</span>Dashboard
      </NavLink>
      <NavLink to="/students" style={linkStyle}>
        <span style={{ marginRight: 8 }}>👥</span>Students
      </NavLink>
      <NavLink to="/courses" style={linkStyle}>
        <span style={{ marginRight: 8 }}>📘</span>Courses
      </NavLink>
      <NavLink to="/enrollments" style={linkStyle}>
        <span style={{ marginRight: 8 }}>🧾</span>Enrollments
      </NavLink>
    </nav>
  );
}