import React, { useEffect, useState } from 'react';

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
};

const TeacherNoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const savedNotices = localStorage.getItem('adminNotices');
    if (savedNotices) {
      setNotices(JSON.parse(savedNotices));
    }
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Teacher Notice Board</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Published Notices</h3>
        {notices.length === 0 ? (
          <p style={styles.noticeText}>No notices available at the moment.</p>
        ) : (
          notices.map((notice, index) => (
            <div key={index} style={styles.noticeItem}>
              <div style={styles.noticeTitle}>{notice.title}</div>
              <div style={styles.noticeText}>{notice.text}</div>
              {notice.date && (
                <div style={styles.noticeDate}>Published on: {notice.date}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherNoticeBoard;