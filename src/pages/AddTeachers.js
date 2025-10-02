import React, { useState } from 'react';

const TeacherRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    father: '',
    dob: '',
    gender: '',
    qualification: '',
    phone: '',
    email: '',
    address: '',
    subject: [],
    classes: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        classes: checked
          ? [...prev.classes, value]
          : prev.classes.filter((c) => c !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You can add API call or validation here
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      background: '#f9f9f9',
    },
    linkStyle : {
    color: "green",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    marginBottom: "1.5rem",
    display: "inline-block",
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
    checkboxGroup: {
      display: 'flex',
      gap: '40px',
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    checkboxLabel: {
      fontWeight: 'normal',
      fontSize: '15px',
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
    
  };


  return (
    <div style={styles.container}>
       <a href="/admindashBoard" style={styles.linkStyle}>← Back to Home</a> 
      <h2 style={styles.heading}>Teacher Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>| Personal Information</h3>
          <div style={styles.formGroup}>
            <div>
              <label style={styles.label}>Full Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Father's Name*</label>
              <input type="text" name="father" value={formData.father} onChange={handleChange} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Date of Birth*</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Gender*</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Qualification*</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>| Contact Information</h3>
          <div style={styles.formGroup}>
            <div>
              <label style={styles.label}>Phone*</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
          <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
            <div>
              <label style={styles.label}>Address*</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>| Academic Information</h3>
          <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
            <div>
              <label style={styles.label}>Subject*</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
          <label style={{ ...styles.label, fontWeight: 'bold' }}>Classes Assigned*</label>
          <div style={styles.checkboxGroup}>
            {[...Array(12)].map((_, i) => (
              <label key={i + 1} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="class"
                  value={String(i + 1)}
                  checked={formData.classes.includes(String(i + 1))}
                  onChange={handleChange}
                />{' '}
                {i + 1}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" style={styles.button}>REGISTER TEACHER</button>
      </form>
    </div>
  );
};

export default TeacherRegistration;