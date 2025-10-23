import React, { useState } from "react";
import "./TeacherForm.css";


function AddTeacherForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    assignedClasses: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Teacher Added: " + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="form-container">
      <div className="teacher-card">
        <h2>Add New Teacher</h2>
        <p>
          Enter teacher details to add them to the system
        </p>
        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="form-group">
            <label>Full Name <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email <span style={{color: 'red'}}>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group">
            <label>Subject Specialization <span style={{color: 'red'}}>*</span></label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select subject</option>
              <option value="Maths">Maths</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Computer">Computer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assigned Classes</label>
            <input
              type="text"
              name="assignedClasses"
              value={formData.assignedClasses}
              onChange={handleChange}
              placeholder="e.g., 10-A"
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="btn-primary">
              Add Teacher
            </button>
            <button type="button" className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeacherForm;
