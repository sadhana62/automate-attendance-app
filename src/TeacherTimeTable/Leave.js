import React, { useState } from "react";
import "./Leave.css";

const Leave = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    className: "",
    phone: "",
    email: "",
    purpose: "",
    fromDate: "",
    toDate: "",
    totalDays: "",
    address: "",
  });

  // Helper to calculate total days
  const calculateTotalDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "";
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = to - from;
    return diffTime >= 0 ? diffTime / (1000 * 60 * 60 * 24) + 1 : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Update totalDays whenever fromDate or toDate changes
    if (name === "fromDate" || name === "toDate") {
      newFormData.totalDays = calculateTotalDays(
        name === "fromDate" ? value : newFormData.fromDate,
        name === "toDate" ? value : newFormData.toDate
      );
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Leave applied for ${formData.firstName} ${formData.lastName}\nTotal Days: ${formData.totalDays}`);
    setFormData({
      firstName: "",
      lastName: "",
      className: "",
      phone: "",
      email: "",
      purpose: "",
      fromDate: "",
      toDate: "",
      totalDays: "",
      address: "",
    });
  };

  return (
    <div className="leave-container">
      <h2>Leave Application Form</h2>
      <form className="leave-form" onSubmit={handleSubmit}>

        {/* First Name & Last Name */}
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Phone & Email */}
        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Class & Purpose */}
        <div className="form-row">
          <input
            type="text"
            name="className"
            placeholder="Class"
            value={formData.className}
            onChange={handleChange}
          />
          <input
            type="text"
            name="purpose"
            placeholder="Purpose of Leave *"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        {/* From & To Date */}
        <div className="form-row">
          <div className="date-input">
            <label>From:</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="date-input">
            <label>To:</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Total Days */}
        <input
          type="text"
          name="totalDays"
          placeholder="Total No. of Days"
          value={formData.totalDays || ""}
          readOnly
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Address where you will stay during leave"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Apply Leave</button>
      </form>
    </div>
  );
};

export default Leave;


