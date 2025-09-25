import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>
        <span>📊</span>Dashboard
      </NavLink>
      <NavLink to="/students" className={({ isActive }) => isActive ? "active" : ""}>
        <span>👥</span>Students
      </NavLink>
      <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>
        <span>📁</span>Courses
      </NavLink>
      <NavLink to="/enrollments" className={({ isActive }) => isActive ? "active" : ""}>
        <span>📄</span>Enrollments
      </NavLink>
    </nav>
  );
}