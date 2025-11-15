import React, { useState, useEffect } from "react";
import "./TeacherTimeTable.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [today, setToday] = useState(new Date().toLocaleDateString("en-US", { weekday: "long" }));

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) {
          throw new Error("User not logged in.");
        }

        const response = await fetch(`http://localhost:3000/api/teacher-timetable/${user.username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch timetable');
        }
        const data = await response.json();
        if (data.success) {
          setTimetable(data.timetable);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return <div className="timetable-container"><h2>Loading Timetable...</h2></div>;
  }

  if (error) {
    return <div className="timetable-container"><h2>Error: {error}</h2></div>;
  }

  if (Object.keys(timetable).length === 0) {
    return <div className="timetable-container"><h2>No timetable assigned.</h2></div>;
  }

  return (
    <div className="timetable-container">
      <h2 className="timetable-heading">My Weekly Timetable</h2>

      <div className="timetable-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className={`day-card ${day === today ? 'current-day' : ''}`}>
            <h3 className="day-heading">{day}</h3>
            {timetable[day] && timetable[day].length > 0 ? (
              <table className="timetable-day-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable[day].map((slot, index) => (
                    <tr key={index}>
                      <td>{slot.time}</td>
                      <td>{slot.class}</td>
                      <td>{slot.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-classes">No classes scheduled.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTimetable;