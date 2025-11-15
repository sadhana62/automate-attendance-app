import React, { useState, useEffect } from "react";
import Attendance from "./Attendance";
import TeacherTimetable from "./TeacherTimetable";
import Leave from "./Leave";
import "./TeacherDashboard.css";
import TeacherNoticeBoard from "../pages/TeacherNoticeBoard";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [isHoliday, setIsHoliday] = useState(false);

  // Check if today is Sunday (holiday)
  useEffect(() => {
    const today = new Date();
    setIsHoliday(today.getDay() === 0);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "attendance":
        return <Attendance />;
      case "timetable":
        return <TeacherTimetable />;
      case "leave":
        return <Leave />;
      case "holiday":
        return (
          <div className="content-box">
            <h2>Holiday</h2>
            <div className="holiday-box">
              <span className={isHoliday ? "yes" : "no"}>
                {isHoliday ? "Yes 🎉 Today is a Holiday" : "No 🏫 Regular Working Day"}
              </span>
            </div>
          </div>
        );
      case "syllabus":
        return (
          <div className="content-box">
            <h2>Syllabus</h2>
            <div className="placeholder-box">
              Syllabus details will appear here.
            </div>
          </div>
        );
      case "notice":
        return <TeacherNoticeBoard />;
      default:
        return null;
    }
  };

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        {["attendance", "timetable", "leave", "holiday", "syllabus", "notice"].map(
          (tab) => (
            <button
              key={tab}
              className={`sidebar-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Main content */}
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default TeacherDashboard;