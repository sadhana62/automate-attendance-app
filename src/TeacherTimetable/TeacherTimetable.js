import React, { useState, useEffect } from "react";
import "./TeacherTimetable.css";

const TeacherTimetable = () => {
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    if (currentDay === "Sunday") {
      setIsHoliday(true);
    }
  }, []);

  const todayRoutine = [
    { time: "8:30 AM - 9:00 AM", className: "-", subject: "Prayer" },
    { time: "9:00 AM - 10:00 AM", className: "Class 1", subject: "Maths" },
    { time: "10:00 AM - 11:00 AM", className: "-", subject: "Leisure" },
    { time: "11:00 AM - 12:00 PM", className: "Class 2", subject: "Science" },
    { time: "12:00 PM - 12:30 PM", className: "-", subject: "Lunch" },
    { time: "12:30 PM - 1:30 PM", className: "Class 3", subject: "GK" },
    { time: "1:30 PM - 2:30 PM", className: "-", subject: "Leisure" },
  ];

  return (
    <div className="timetable-container">
      {/* Heading */}
      <h2 className="timetable-heading">Timetable</h2>

      {/* Timetable Table */}
      <div className="timetable-card">
        <table className="timetable">
          <thead>
            <tr>
              <th>Time</th>
              <th>Class</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {todayRoutine.map((item, index) => (
              <tr
                key={index}
                className={
                  ["Leisure", "Prayer", "Lunch"].includes(item.subject)
                    ? "special-period"
                    : ""
                }
              >
                <td>{item.time}</td>
                <td>{item.className}</td>
                <td>{item.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Holiday Section */}
      <div className="holiday-section">
        <h2>Holiday</h2>
        <div className="holiday-box">
          <span className={isHoliday ? "yes" : "no"}>
            {isHoliday ? "Yes, Today is a Holiday" : "No, Regular Working Day"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetable;


