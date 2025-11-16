import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    background: '#f9f9f9',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
  },
  section: {
    border: '1px solid #ddd',
    borderLeft: '4px solid green',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    background: 'white',
  },
  sectionTitle: {
    marginTop: 0,
    fontSize: '18px',
    marginBottom: '15px',
    color: 'green',
  },
  formGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '15px',
  },
  formGroupFull: {
    gridTemplateColumns: '1fr',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '100%',
  },
  button: {
    display: 'block',
    margin: '20px auto 0',
    padding: '12px 25px',
    fontSize: '16px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  noticeItem: {
    borderBottom: '1px solid #eee',
    padding: '10px 0',
  },
  noticeTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: 'green',
  },
  noticeText: {
    fontSize: '14px',
    marginTop: '5px',
  },
  noticeDate: {
    fontSize: '12px',
    color: '#666',
    marginTop: '3px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '12px',
    float: 'right',
  },
};

const AdminNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const fetchNotices = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/notices');
      const data = await response.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !text) return;

    try {
      const response = await fetch('http://localhost:3000/api/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text }),
      });
      const data = await response.json();
      if (data.success) {
        fetchNotices(); // Refresh notices
        setTitle('');
        setText('');
      } else {
        alert(data.message || 'Failed to post notice.');
      }
    } catch (error) {
      alert('An error occurred while posting the notice.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      await fetch(`http://localhost:3000/api/notice/${id}`, { method: 'DELETE' });
      fetchNotices(); // Refresh notices
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Notice Board</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Post a New Notice</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
            <div>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                placeholder="Enter notice title"
              />
            </div>
            <div>
              <label style={styles.label}>Description</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ ...styles.input, height: '100px' }}
                placeholder="Enter notice description"
              />
            </div>
          </div>
          <button type="submit" style={styles.button}>Publish Notice</button>
        </form>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Published Notices</h3>
        {notices.length === 0 ? (
          <p style={styles.noticeText}>No notices posted yet.</p>
        ) : (
          notices.map((notice, index) => (
            <div key={index} style={styles.noticeItem}>
              <button onClick={() => handleDelete(notice.id)} style={styles.deleteButton}>Delete</button>
              <div style={styles.noticeTitle}>{notice.title}</div>
              <div style={styles.noticeText}>{notice.text}</div>
              <div style={styles.noticeDate}>
                Published on: {notice.created_at_formatted}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNoticeBoard;