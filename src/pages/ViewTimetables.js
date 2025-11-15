import React, { useState, useEffect } from 'react';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:30 PM - 1:20 PM",
  "1:30 PM - 2:30 PM"
];

const ViewTimetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/timetables');
        const data = await response.json();
        if (data.success) {
          // The data from the DB is a JSON string, so we need to parse it.
          const parsedTimetables = data.timetables.map(tt => ({
            ...tt,
            timetable_data: typeof tt.timetable_data === 'string' 
              ? JSON.parse(tt.timetable_data) 
              : tt.timetable_data
          }));
          console.log("Fetched and Parsed Timetables:", parsedTimetables); // Console log for debugging
          setTimetables(parsedTimetables);
        } else {
          throw new Error(data.message || 'Failed to fetch timetables');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetables();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/timetable/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('Timetable deleted successfully!');
        setTimetables(timetables.filter(tt => tt.id !== id));
      } else {
        throw new Error(data.message || 'Failed to delete timetable');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div style={styles.centered}>Loading timetables...</div>;
  if (error) return <div style={{...styles.centered, color: 'red'}}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.mainHeading}>📚 All Saved Timetables</h2>
      {timetables.length === 0 ? (
        <p style={styles.centered}>No timetables have been created yet.</p>
      ) : (
        timetables.map(tt => (
          <div key={tt.id} style={styles.timetableWrapper}>
            <div style={styles.headerContainer}>
              <h3 style={styles.subHeading}>
                Class: {tt.class_name} - Section: {tt.section_name}
              </h3>
              <button onClick={() => handleDelete(tt.id)} style={styles.deleteButton}>🗑️ Delete</button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Time</th>
                  {days.map(day => <th key={day} style={styles.tableHeader}>{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, timeIdx) => (
                  <tr key={slot}>
                    <td style={styles.timeColumn}>{slot}</td>
                    {days.map((_, dayIdx) => {
                      const entry = tt.timetable_data[timeIdx]?.[dayIdx] || { subject: '', teacher: '' };
                      return (
                        <td key={`${timeIdx}-${dayIdx}`} style={styles.cell}>
                          <div><strong>{entry.subject || '-'}</strong></div>
                          <div style={{fontSize: '12px', color: '#555'}}>{entry.teacher || ''}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#f4f8fc' },
  centered: { textAlign: 'center', fontSize: '18px', padding: '40px' },
  mainHeading: { color: '#dd3b12ff', textAlign: 'center', marginBottom: '30px' },
  timetableWrapper: {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  subHeading: { color: '#c46f0dff', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  tableHeaderRow: { backgroundColor: '#c46f0dff', color: '#fff' },
  tableHeader: { padding: '12px', border: '1px solid #ddd' },
  timeColumn: { padding: '10px', fontWeight: '600', backgroundColor: '#ecf0f1', border: '1px solid #ddd', textAlign: 'center' },
  cell: { border: '1px solid #ddd', padding: '10px', textAlign: 'center' },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
};

export default ViewTimetables;