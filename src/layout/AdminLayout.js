// src/layout/AdminLayout.js
import { Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Teachers from "../pages/Admin/Teachers";
import Students from "../pages/Admin/Students";
import Classes from "../pages/Admin/Classes";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#f4f4f4", padding: "20px" }}>
        <h3>Admin Panel</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/admin/dashboard">Overview</Link></li>
          <li><Link to="/admin/teachers">Teachers</Link></li>
          <li><Link to="/admin/students">Students</Link></li>
          <li><Link to="/admin/classes">Classes</Link></li>
        </ul>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
        </Routes>
      </div>
    </div>
  );
}
