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
        const storedUser = localStorage.getItem('Tname');
        let user = null;
        let rawUserString = null;
        try {
          if (storedUser) {
            user = JSON.parse(storedUser);
          }
        } catch (e) {
          // storedUser is not JSON, keep raw string
          rawUserString = storedUser;
          user = null;
        }

        const username = user?.username || localStorage.getItem('username') || rawUserString;
        const displayName = user?.name || user?.fullname || localStorage.getItem('displayName') || localStorage.getItem('name') || rawUserString;
        if (!username && !displayName) throw new Error('User not logged in.');

        const response = await fetch('http://localhost:3000/api/timetables');
        if (!response.ok) throw new Error('Failed to fetch timetables');
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'No timetables');

        console.log('TeacherTimetable: using username=', username, 'displayName=', displayName);
        console.log('TeacherTimetable: timetables fetched=', (data.timetables || []).length);

        // Prepare days and timeSlots mapping similar to admin page
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const timeSlots = [
          "9:00 AM - 10:00 AM",
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "12:30 PM - 1:20 PM",
          "1:30 PM - 2:30 PM"
        ];

        // Aggregate slots for this teacher across all stored timetables
        const teacherTimetable = days.reduce((acc, d) => ({ ...acc, [d]: [] }), {});

        // helpers: normalize names and match name parts
        const normalize = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');
        const namePartsMatch = (a, b) => {
          if (!a || !b) return false;
          const aParts = a.split(' ');
          const bParts = b.split(' ');
          return aParts.some(p => b.includes(p)) || bParts.some(p => a.includes(p));
        };

        for (const t of data.timetables || []) {
          let tt = t.timetable_data;
          if (typeof tt === 'string') {
            try { tt = JSON.parse(tt); } catch (e) { /* keep as-is */ }
          }

          const classLabel = t.class_name ? `${t.class_name} (${t.section_name})` : `${t.class_id}-${t.section_name}`;

          // Case A: timetable_data is object with day keys -> arrays of slots
          if (tt && typeof tt === 'object' && !Array.isArray(tt)) {
            for (const dayKey of Object.keys(tt)) {
              const dayEntries = tt[dayKey] || [];
              for (const entry of dayEntries) {
                // entry may have { time, subject, teacher, class }
                const teacherField = (entry.teacher || entry.username || entry.instructor || '').toString();
                const tf = normalize(teacherField);
                const uname = username ? normalize(username) : '';
                const dname = displayName ? normalize(displayName) : '';
                const match = (uname && (tf === uname || tf.includes(uname) || uname.includes(tf) || namePartsMatch(tf, uname)))
                  || (dname && (tf === dname || tf.includes(dname) || dname.includes(tf) || namePartsMatch(tf, dname)));
                if (match) {
                  teacherTimetable[dayKey] = teacherTimetable[dayKey] || [];
                  teacherTimetable[dayKey].push({
                    time: entry.time || entry.period || '',
                    class: entry.class || classLabel,
                    subject: entry.subject || entry.name || ''
                  });
                }
              }
            }
          }

          // Case B: timetable_data is 2D array [timeIdx][dayIdx]
          if (Array.isArray(tt)) {
            for (let timeIdx = 0; timeIdx < tt.length; timeIdx++) {
              const row = tt[timeIdx] || [];
              for (let dayIdx = 0; dayIdx < row.length; dayIdx++) {
                const cell = row[dayIdx] || {};
                const teacherField = (cell.teacher || cell.username || cell.instructor || '').toString();
                const dayName = days[dayIdx] || days[dayIdx % days.length];
                const tf2 = normalize(teacherField);
                const uname2 = username ? normalize(username) : '';
                const dname2 = displayName ? normalize(displayName) : '';
                const match2 = (uname2 && (tf2 === uname2 || tf2.includes(uname2) || uname2.includes(tf2) || namePartsMatch(tf2, uname2)))
                  || (dname2 && (tf2 === dname2 || tf2.includes(dname2) || dname2.includes(tf2) || namePartsMatch(tf2, dname2)));
                if (match2) {
                  teacherTimetable[dayName] = teacherTimetable[dayName] || [];
                  teacherTimetable[dayName].push({
                    time: cell.time || timeSlots[timeIdx] || '',
                    class: cell.class || classLabel,
                    subject: cell.subject || ''
                  });
                }
              }
            }
          }
        }

        setTimetable(teacherTimetable);
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