import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RegistrationForm.css";

import AddClass from "./AddClass";
import FaceRegister from "./RegisterPage";
import Attendance from "./AttendancePage";
import QRCodes from "./QR";
import AddTeacher from "./AddTeachers";
import Dynamictimetable from './Dynamictimetable';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("add");
  const [showAddClass, setShowAddClass] = useState(false);
  const [showFaceRegister, setShowFaceRegister] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showQRCodes, setShowQRCodes] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // State for dynamic dropdown options
  const [classOptions, setClassOptions] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [interestOptions, setInterestOptions] = useState([]);
  // New state for timetable data
  const [timetableOptions, setTimetableOptions] = useState({ classes: [], sections: [], subjects: [], teachers: [] });


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    class: "",
    section: "",
    fatherName: "",
    motherName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    bloodGroup: "",
    password: "",
    interest: [], // 👈 NEW field
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/all-students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/all-teachers");
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  useEffect(() => {
    if (activePage === "view") {
      fetchStudents();
    }
    if (showTimetable) {
      const fetchTimetableData = async () => {
        const res = await fetch("http://localhost:3000/api/timetable-options");
        const data = await res.json();
        if (data.success) setTimetableOptions(data);
      };
      fetchTimetableData();
    }
    // eslint-disable-next-line
  }, [activePage, showTimetable]);
  
  // Fetch options for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/registration-options");
        const data = await res.json();
        if (data.success) {
          setClassOptions(data.classes);
          setAllSections(data.sections);
          setInterestOptions(data.interests);
        }
      } catch (err) {
        console.error("Failed to fetch registration options", err);
      }
    };
    fetchOptions();
  }, []);

  // Options
  useEffect(() => {
    if (formData.class && classOptions.length > 0 && allSections.length > 0) {
      const selectedClassObj = classOptions.find(c => c.value === formData.class);
      const relevantSections = allSections.filter(s => s.class_id === selectedClassObj.id);
      setSectionOptions(relevantSections.map(s => ({ value: s.name, label: s.name })));
    }
  }, [formData.class, classOptions, allSections]);

  const bloodGroupOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ].map((g) => ({ value: g, label: g }));
  const genderOptions = ["Male", "Female", "Other"].map((g) => ({
    value: g,
    label: g,
  }));
  const stateOptions = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ].map((s) => ({ value: s, label: s }));

  // Select styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "45px",
      border: "2px solid #e1e5e9",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#4CAF50" : "#e1e5e9",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(76, 175, 80, 0.1)" : "none",
      "&:hover": { borderColor: "#4CAF50" },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4CAF50"
        : state.isFocused
        ? "#f0f8f0"
        : "white",
      color: state.isSelected ? "white" : "#333",
      padding: "10px 15px",
    }),
    placeholder: (provided) => ({ ...provided, color: "#999" }),
    menu: (provided) => ({
      ...provided,
      zIndex: 999, // default is ~9999, make it lower
    }),
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dob: date }));
  };
  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData((prev) => ({
      ...prev,
      [actionMeta.name]: selectedOption
        ? actionMeta.name === "interest"
          ? selectedOption.map((opt) => opt.value) // multi-select
          : selectedOption.value
        : actionMeta.name === "interest"
        ? []
        : "",
    }));
  };

  const handleSubmit = async (e) => {
    console.log("Form Data on Submit:", formData);
    e.preventDefault();
    const payload = {
      name: formData.firstName + " " + formData.lastName,
      father_name: formData.fatherName,
      mother_name: formData.motherName,
      dob: formData.dob,
      gender: formData.gender,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zipCode,
      phone: formData.phone,
      email: formData.email,
      blood_group: formData.bloodGroup,
      password: formData.password,
      class: formData.class,
      section: formData.section,
      interests: formData.interest,
    };

    const isUpdating = editingIndex !== null;
    const url = isUpdating
      ? `http://localhost:3000/api/student/${students[editingIndex].id}`
      : "http://localhost:3000/register-student";
    const method = isUpdating ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Student ${isUpdating ? "updated" : "registered"} successfully!`);
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          gender: "",
          class: "",
          section: "",
          fatherName: "",
          motherName: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          phone: "",
          email: "",
          bloodGroup: "",
          password: "",
          interest: [],
        });
        setEditingIndex(null);
        setActivePage("view");
        fetchStudents(); // Refresh list
      } else {
        console.log("Else part");
        alert(data.message || `${isUpdating ? "Update" : "Registration"} failed`);
      }
    } catch (err) {
      alert(`Error ${isUpdating ? "updating" : "registering"} student`);
      console.error(err);
    }
  };

  const handleEdit = (index) => {
    const student = students[index];
    const nameParts = student.name.split(" ");
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      dob: student.dob ? new Date(student.dob) : "",
      gender: student.gender || "",
      class: student.class || "",
      section: student.section || "",
      fatherName: student.father_name || "",
      motherName: student.mother_name || "",
      street: student.street || "",
      city: student.city || "",
      state: student.state || "",
      zipCode: student.zip || "",
      phone: student.phone || "",
      email: student.email || "",
      bloodGroup: student.blood_group || "",
      password: student.password || "",
      interest: student.interests || [],
    });
    setEditingIndex(index);
    setActivePage("add");
  };

  const handleDelete = async (index) => {
    const studentToDelete = students[index];
    if (window.confirm(`Are you sure you want to delete ${studentToDelete.name}?`)) {
      try {
        const res = await fetch(`http://localhost:3000/api/student/${studentToDelete.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          alert('Student deleted successfully!');
          fetchStudents(); // Refresh the list from the DB
        } else {
          alert(data.message || 'Failed to delete student.');
        }
      } catch (err) {
        alert('An error occurred while deleting the student.');
        console.error(err);
      }
    }
  };

  // Layout styles
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Georgia",
  };
  const sidebarStyle = {
    width: "220px",
    background: "white",
    color: "black",
    padding: "20px",
  };
  const sidebarItemStyle = (isActive) => ({
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: isActive ? "green" : "transparent",
    color: isActive ? "white" : "black",
  });
  const contentStyle = { flex: 1, padding: "30px", backgroundColor: "#f5f6fa" };
  const cardStyle = {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  };
  const headingStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };
  const thtdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",

    
  };
  const editButtonStyle = {
    backgroundColor: "#2196F3", // Blue
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: "5px",
    fontSize: "14px",
  };

  const deleteButtonStyle = {
    backgroundColor: "#f44336", // Red
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
  };

  // Content renderer
  const renderContent = () => {
    if (activePage === "add") {
      return (
        <div style={cardStyle}>
          <h2 style={headingStyle}>
            {editingIndex !== null ? "Edit Student" : "Add Student"}
          </h2>
          <div className="registration-form">
            <div className="form-container">
              <div className="form-content">
                <form onSubmit={handleSubmit}>
                  {/* PERSONAL INFO */}
                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name*</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name*</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Date of Birth*</label>
                        <DatePicker
                          selected={formData.dob}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select date"
                          showYearDropdown
                          scrollableYearDropdown
                          maxDate={new Date()}
                          className="date-picker-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender*</label>
                        <Select
                          name="gender"
                          options={genderOptions}
                          value={genderOptions.find(
                            (o) => o.value === formData.gender
                          )}
                          onChange={handleSelectChange}
                          placeholder="Select Gender"
                        />
                      </div>
                      <div className="form-group">
                        <label>Class*</label>
                        <Select
                          name="class"
                          options={classOptions}
                          value={classOptions.find(
                            (o) => o.value === formData.class
                          )}
                          onChange={handleSelectChange}
                          styles={customSelectStyles}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          placeholder="Select Class"
                        />
                      </div>
                      <div className="form-group">
                        <label>Section*</label>
                        <Select
                          name="section"
                          options={sectionOptions}
                          value={sectionOptions.find(
                            (o) => o.value === formData.section
                          )}
                          onChange={handleSelectChange}
                          styles={customSelectStyles}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          placeholder="Select Section"
                        />
                      </div>
                      <div className="form-group form-group-full">
                        <label>Interests*</label>
                        <Select
                          name="interest"
                          options={interestOptions}
                          value={interestOptions.filter((opt) =>
                            formData.interest.includes(opt.value)
                          )}
                          onChange={handleSelectChange}
                          styles={customSelectStyles}
                          placeholder="Select Interests"
                          isMulti
                        />
                      </div>
                    </div>
                  </div>

                  {/* PARENT INFO */}
                  <div className="form-section">
                    <h3>Parental Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Father's Name*</label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Mother's Name*</label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="form-section">
                    <h3>Address Information*</h3>
                    <div className="form-grid">
                      <div className="form-group form-group-full">
                        <label>Street</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>City*</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State*</label>
                        <Select
                          name="state"
                          options={stateOptions}
                          value={stateOptions.find(
                            (o) => o.value === formData.state
                          )}
                          onChange={handleSelectChange}
                          styles={customSelectStyles}
                          placeholder="Select State"
                        />
                      </div>
                      <div className="form-group">
                        <label>Zip Code*</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="form-section">
                    <h3>Contact & Medical Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Blood Group</label>
                        <Select
                          name="bloodGroup"
                          options={bloodGroupOptions}
                          value={bloodGroupOptions.find(
                            (o) => o.value === formData.bloodGroup
                          )}
                          onChange={handleSelectChange}
                          styles={customSelectStyles}
                          placeholder="Select Blood Group"
                        />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    {editingIndex !== null
                      ? "Update Student"
                      : "Register Student"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activePage === "view") {
      // Group students by class
      const studentsByClass = students.reduce((acc, student) => {
        const studentClass = student.class || "Unassigned";
        if (!acc[studentClass]) {
          acc[studentClass] = [];
        }
        acc[studentClass].push(student);
        return acc;
      }, {});

      // Sort class keys numerically
      const sortedClasses = Object.keys(studentsByClass).sort((a, b) => {
        if (a === "Unassigned") return 1;
        if (b === "Unassigned") return -1;
        return parseInt(a, 10) - parseInt(b, 10);
      });

      return (
        <div style={cardStyle}>
          <h2 style={headingStyle}>View Student Details</h2>
          {students.length === 0 ? (
            <p>No students registered yet.</p>
          ) : (
            sortedClasses.map((className) => (
              <div key={className} style={{ marginBottom: "40px" }}>
                <h3 style={{ ...headingStyle, fontSize: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                  Class: {className}
                </h3>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thtdStyle}>First</th>
                      <th style={thtdStyle}>Last</th>
                      <th style={thtdStyle}>Section</th>
                      <th style={thtdStyle}>Father</th>
                      <th style={thtdStyle}>Mother</th>
                      <th style={thtdStyle}>DOB</th>
                      <th style={thtdStyle}>Gender</th>
                      <th style={thtdStyle}>Phone</th>
                      <th style={thtdStyle}>Email</th>
                      <th style={thtdStyle}>Blood</th>
                      <th style={thtdStyle}>Interests</th>
                      <th style={thtdStyle}>Address</th>
                      <th style={thtdStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsByClass[className].map((s, i) => {
                      const originalIndex = students.findIndex(student => student.id === s.id);
                      return (
                        <tr key={s.id}>
                          <td style={thtdStyle}>{s.name?.split(" ")[0]}</td>
                          <td style={thtdStyle}>{s.name?.split(" ").slice(1).join(" ") || ""}</td>
                          <td style={thtdStyle}>{s.section || "N/A"}</td>
                          <td style={thtdStyle}>{s.father_name}</td>
                          <td style={thtdStyle}>{s.mother_name}</td>
                          <td style={thtdStyle}>{s.dob ? new Date(s.dob).toLocaleDateString() : ""}</td>
                          <td style={thtdStyle}>{s.gender}</td>
                          <td style={thtdStyle}>{s.phone}</td>
                          <td style={thtdStyle}>{s.email}</td>
                          <td style={thtdStyle}>{s.blood_group}</td>
                          <td style={thtdStyle}>{s.interests?.join(", ") || "—"}</td>
                          <td style={thtdStyle}>{`${s.street || ''}, ${s.city || ''}, ${s.state || ''}, ${s.zip || ''}`}</td>
                          <td style={{ ...thtdStyle, display: "flex" }}>
                            <button onClick={() => handleEdit(originalIndex)} style={editButtonStyle}>Edit</button>
                            <button onClick={() => handleDelete(originalIndex)} style={deleteButtonStyle}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      );
    }
      if (showAddClass) {
      return <AddClass />;
    }

    if (showFaceRegister) {
      return <FaceRegister />;
    }

    if (showAttendance) {
      return <Attendance />;
    }

    if (showQRCodes) {
      return <QRCodes />;
    }

    if (showAddTeacher) {
      return <AddTeacher />;
    }

    if (showTimetable) {
      return <Dynamictimetable {...timetableOptions} />;
    }
  };

  return (
   <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "30px", fontSize: "20px" }}>Admin Panel</h2>
        <div
          style={sidebarItemStyle(activePage === "add")}
          onClick={() => {
            setActivePage("add");
            setEditingIndex(null);
            setShowAddClass(false);
            setShowFaceRegister(false);
            setShowAttendance(false);
            setShowQRCodes(false);
            setShowAddTeacher(false);
            setShowTimetable(false);
          }}
        >
          Add Student
        </div>
        <div
          style={sidebarItemStyle(activePage === "view")}
          onClick={() => {
            setActivePage("view");
            setShowAddClass(false);
            setShowFaceRegister(false);
            setShowAttendance(false);
            setShowQRCodes(false);
            setShowAddTeacher(false);
            setShowTimetable(false);
          }}
        >
          View Student Details
        </div>
        <Link to="#" style={{ textDecoration: "none" }} onClick={(e) => {
          e.preventDefault();
          setActivePage("");
          setShowAddClass(true);
          setShowFaceRegister(false);
          setShowAttendance(false);
          setShowQRCodes(false);
          setShowAddTeacher(false);
          setShowTimetable(false);
        }}>
          <div style={sidebarItemStyle(showAddClass)}>Add Class</div>
        </Link>
        <Link to="#" style={{ textDecoration: "none" }} onClick={(e) => {
          e.preventDefault();
          setActivePage("");
          setShowAddClass(false);
          setShowFaceRegister(true);
          setShowAttendance(false);
          setShowQRCodes(false);
          setShowAddTeacher(false);
          setShowTimetable(false);
        }}>
          <div style={sidebarItemStyle(showFaceRegister)}>Face Register</div>
        </Link>
        <Link to="#" style={{ textDecoration: "none" }} onClick={(e) => {
          e.preventDefault();
          setActivePage("");
          setShowAddClass(false);
          setShowFaceRegister(false);
          setShowAttendance(true);
          setShowQRCodes(false);
          setShowAddTeacher(false);
          setShowTimetable(false);
        }}>
          <div style={sidebarItemStyle(showAttendance)}>Attendance</div>
        </Link>
        <Link to="#" style={{ textDecoration: "none" }} onClick={(e) => {
          e.preventDefault();
          setActivePage("");
          setShowAddClass(false);
          setShowFaceRegister(false);
          setShowAttendance(false);
          setShowQRCodes(true);
          setShowAddTeacher(false);
          setShowTimetable(false);
        }}>
          <div style={sidebarItemStyle(showQRCodes)}>QR Codes</div>
        </Link>
        <Link to="#" style={{ textDecoration: "none" }} onClick={(e) => {
          e.preventDefault();
          setActivePage("");
          setShowAddClass(false);
          setShowFaceRegister(false);
          setShowAttendance(false);
          setShowQRCodes(false);
          setShowAddTeacher(true);
          setShowTimetable(false);
        }}>
          <div style={sidebarItemStyle(showAddTeacher)}>Add Teacher</div>
        </Link>
        <Link to="#" style={{ textDecoration: "none" }} onClick={(e) => {
          e.preventDefault();
          setActivePage("");
          setShowAddClass(false);
          setShowFaceRegister(false);
          setShowAttendance(false);
          setShowQRCodes(false);
          setShowAddTeacher(false);
          setShowTimetable(true);
        }}>
          <div style={sidebarItemStyle(showTimetable)}>Create Timetable</div>
        </Link>
      </div>

     

      {/* Main Content */}
      <div style={contentStyle}>{renderContent()}</div>
    </div>
  );
}
