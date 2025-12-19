import React, { useEffect, useState } from "react";
import "./Attendance.css";

const Attendance = () => {
  const [teacher, setTeacher] = useState(null);


  const TIME_IN = "09:00 AM";
  const TIME_OUT = "03:30 PM";

  function formatDate(d) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  function getDayName(d) {
    return d.toLocaleDateString(undefined, { weekday: 'long' });
  }

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/all-teachers');
        const data = await res.json();
        console.log("Teachers data ",data);
        if (data.success && Array.isArray(data.teachers) && data.teachers.length > 0) {
         
          const username = localStorage.getItem('username');
        
          let t = null;
          if (username) {
            t = data.teachers.find(tt => tt.username === username);
          }
          if (!t) t = data.teachers[0]; 

       
          let designation = t.qualification || '';
          try {
            if (t.subject) {
              const subj = typeof t.subject === 'string' ? JSON.parse(t.subject) : t.subject;
              if (Array.isArray(subj) && subj.length > 0) designation = subj[0];
            }
          } catch (e) {
            // ignore parse errors
          }

          setTeacher({
            name: t.name || 'Teacher',
            id: t.id || t.username || 'T-NA',
            designation: designation || 'Teacher',
            totalClasses: t.totalClasses || 10,
            classesTaken: t.classesTaken || 8,
            absent: t.absent || 2,
            qualification: t.qualification
          });
          localStorage.setItem("Tname",t.name);
        }
      } catch (err) {
        console.error('Failed to fetch teachers', err);
      }
    };

    fetchTeacher();
  }, []);

  const today = new Date();
  const dateStr = formatDate(today);
  const dayName = getDayName(today);

  return (
    <div className="attendance-container">
      {/* QR Code Section */}
      <div className="qr-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/assets/TeacherQR.png" alt="QR Code" style={{ maxWidth: 200, width: '100%', height: 'auto' }} />
      </div>

      {/* Attendance Card */}
      <div className="attendance-card">
        {/* Teacher Info */}
        <div className="card-row">
          <div className="card-box"><strong>Name:</strong> {teacher ? teacher.name : 'Loading...'}</div>
          <div className="card-box"><strong>ID:</strong> {teacher ? teacher?.id : '50'}</div>
          <div className="card-box"><strong>Qualification:</strong> {teacher ? teacher.qualification : 'BSc.(H) MAths'}</div>
        </div>

        {/* Attendance Info */}
        <div className="card-row">
          <div className="card-box"><strong>Time In:</strong> {TIME_IN}</div>
          <div className="card-box"><strong>Time Out:</strong> {TIME_OUT}</div>
          <div className="card-box"><strong>Date:</strong> {dateStr}</div>
          <div className="card-box"><strong>Day:</strong> {dayName}</div>
        </div>

        {/* Monthly Stats */}
        <div className="card-row">
          <div className="card-box"><strong>Total Classes:</strong> {teacher ? teacher.totalClasses : 0}</div>
          <div className="card-box"><strong>Classes Taken:</strong> {teacher ? teacher.classesTaken : 0}</div>
          <div className="card-box"><strong>Absent:</strong> {teacher ? teacher.absent : 0}</div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;


