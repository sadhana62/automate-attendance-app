import React, { useState, useEffect } from 'react';

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/all-teachers');
        const data = await response.json();
        if (data.success) {
          setTeachers(data.teachers);
        } else {
          throw new Error(data.message || 'Failed to fetch teachers');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) return <div style={styles.centered}>Loading teachers...</div>;
  if (error) return <div style={{...styles.centered, color: 'red'}}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.mainHeading}>Teacher Details</h2>
      {teachers.length === 0 ? (
        <p style={styles.centered}>No teachers have been registered yet.</p>
      ) : (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thtd}>Name</th>
                <th style={styles.thtd}>Father's Name</th>
                <th style={styles.thtd}>Email</th>
                <th style={styles.thtd}>Phone</th>
                <th style={styles.thtd}>Qualification</th>
                <th style={styles.thtd}>Subjects</th>
                <th style={styles.thtd}>Classes</th>
                <th style={styles.thtd}>Address</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
                <tr key={teacher.id}>
                  <td style={styles.thtd}>{teacher.name}</td>
                  <td style={styles.thtd}>{teacher.father_name}</td>
                  <td style={styles.thtd}>{teacher.email}</td>
                  <td style={styles.thtd}>{teacher.phone}</td>
                  <td style={styles.thtd}>{teacher.qualification}</td>
                  <td style={styles.thtd}>{teacher.subject ? JSON.parse(teacher.subject).join(', ') : ''}</td>
                  <td style={styles.thtd}>{teacher.classes ? JSON.parse(teacher.classes).join(', ') : ''}</td>
                  <td style={styles.thtd}>{teacher.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
  },
  centered: {
    textAlign: 'center',
    fontSize: '18px',
    padding: '40px',
  },
  mainHeading: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  thtd: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
};

export default ViewTeachers;