// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import FeatureApp from "./pages/FeatureApp";
import RegisterPage from "./pages/RegisterPage";
import AttendancePage from "./pages/AttendancePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashBoard";
import AddTeachers from "./pages/AddTeachers";
import RegistrationForm from "./pages/RegistrationForm";
import QR from "./pages/QR";

function App() {
  

  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<LoginPage/>} />
        <Route path="/admindashBoard" element={<AdminDashboard/>} />

        {/* Register page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Attendance page */}
        <Route path="/attendance" element={<AttendancePage />} />

      <Route path="/qr" element={<QR />} />

      {/* Add Teacher */}
        <Route path="/Teacher" element={<AddTeachers />} />


        {/* 404 fallback */}
        <Route path="*" element={<h1 style={{ textAlign: "center" }}>404 Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
