import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#333',
  },
  section: {
    border: '1px solid #ddd',
    borderLeft: '4px solid #007bff',
    borderRadius: '8px',
    padding: '25px',
    background: 'white',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'block',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    minHeight: '120px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  button: {
    display: 'block',
    margin: '30px auto 0',
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
};

const TeacherLeaveApplication = () => {
  const [leaveDetails, setLeaveDetails] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    // Fetch teacher details from localStorage on component mount
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setTeacher(JSON.parse(loggedInUser));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leaveDetails.startDate || !leaveDetails.endDate || !leaveDetails.reason) {
      alert('Please fill in all fields.');
      return;
    }
    // Here you would typically send the data to a backend API
    console.log('Submitting Leave Application:', {
      teacher: teacher,
      ...leaveDetails,
    });
    alert('Leave application submitted successfully!');
    // Reset form
    setLeaveDetails({
      leaveType: 'Sick Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Leave Application</h2>
      <div style={styles.section}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Leave Type</label>
              <select name="leaveType" value={leaveDetails.leaveType} onChange={handleChange} style={styles.input}>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Earned Leave</option>
                <option>Maternity Leave</option>
                <option>Other</option>
              </select>
            </div>
            <div style={styles.formGroup}></div> {/* Empty div for grid alignment */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <input type="date" name="startDate" value={leaveDetails.startDate} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input type="date" name="endDate" value={leaveDetails.endDate} onChange={handleChange} style={styles.input} />
            </div>
            <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
              <label style={styles.label}>Reason for Leave</label>
              <textarea name="reason" value={leaveDetails.reason} onChange={handleChange} style={styles.textarea} placeholder="Please provide a reason for your leave..." />
            </div>
          </div>
          <button type="submit" style={styles.button}>Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLeaveApplication;