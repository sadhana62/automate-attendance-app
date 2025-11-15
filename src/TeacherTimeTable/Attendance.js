import React from "react";
import "./Attendance.css";

const Attendance = () => {
  // Sample teacher data
  const teacher = {
    name: "Anushka Kumari",
    id: "T101",
    designation: "Mathematics",
    timeIn: "09:00 AM",
    timeOut: "03:30 PM",
    date: "23-Oct-2025",
    day: "Thursday",
    totalClasses: 22,
    classesTaken: 20,
    absent: 2,
  };

  return (
    <div className="attendance-container">
      {/* QR Code Section */}
      <div className="qr-section">
        <em>QR Code Placeholder</em>
      </div>

      {/* Attendance Card */}
      <div className="attendance-card">
        {/* Teacher Info */}
        <div className="card-row">
          <div className="card-box"><strong>Name:</strong> {teacher.name}</div>
          <div className="card-box"><strong>ID:</strong> {teacher.id}</div>
          <div className="card-box"><strong>Designation:</strong> {teacher.designation}</div>
        </div>

        {/* Attendance Info */}
        <div className="card-row">
          <div className="card-box"><strong>Time In:</strong> {teacher.timeIn}</div>
          <div className="card-box"><strong>Time Out:</strong> {teacher.timeOut}</div>
          <div className="card-box"><strong>Date:</strong> {teacher.date}</div>
          <div className="card-box"><strong>Day:</strong> {teacher.day}</div>
        </div>

        {/* Monthly Stats */}
        <div className="card-row">
          <div className="card-box"><strong>Total Classes:</strong> {teacher.totalClasses}</div>
          <div className="card-box"><strong>Classes Taken:</strong> {teacher.classesTaken}</div>
          <div className="card-box"><strong>Absent:</strong> {teacher.absent}</div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;


