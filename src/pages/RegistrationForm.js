import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    class: '', section: '',
    fatherName: '', motherName: '',
    street: '', city: '', state: '', zipCode: '',
    phone: '', email: '', bloodGroup: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      dob: date
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData(prevState => ({
      ...prevState,
      [actionMeta.name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // Options for react-select
  const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    .map(cls => ({ value: cls, label: cls }));

  const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F']
    .map(section => ({ value: section, label: section }));

  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    .map(group => ({ value: group, label: group }));

  const genderOptions = ['Male', 'Female', 'Other']
    .map(gender => ({ value: gender, label: gender }));

  const stateOptions = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal'
  ].map(state => ({ value: state, label: state }));

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '45px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none',
      borderColor: state.isFocused ? '#4CAF50' : '#e1e5e9',
      '&:hover': {
        borderColor: '#4CAF50'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#f0f8f0' : 'white',
      color: state.isSelected ? 'white' : '#333',
      padding: '10px 15px'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999'
    })
  };

  return (
    <div className="registration-form">
      <div className="form-container">
        <div className="form-header">
          <h2>Student Registration</h2>
        </div>
        
        <div className="form-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
               <DatePicker
                    selected={formData.dob}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date of birth"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    maxDate={new Date()}
                    id="dob"
                    name="dob"
                    required
                    className="date-picker-input"
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <Select
                    name="gender"
                    options={genderOptions}
                    value={genderOptions.find(option => option.value === formData.gender)}
                    onChange={handleSelectChange}
                    placeholder="Select Gender"
                    isSearchable={true}
                  />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <Select
                    name="class"
                    options={classOptions}
                    value={classOptions.find(option => option.value === formData.class)}
                    onChange={handleSelectChange}
                    placeholder="Select Class"
                    styles={customSelectStyles}
                    isSearchable={true}
                  />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <Select
                    name="section"
                    options={sectionOptions}
                    value={sectionOptions.find(option => option.value === formData.section)}
                    onChange={handleSelectChange}
                    placeholder="Select Section"
                    styles={customSelectStyles}
                    isSearchable={true}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Parental Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fatherName">Father's Name</label>
                  <input 
                    type="text" 
                    id="fatherName" 
                    name="fatherName" 
                    value={formData.fatherName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter father's name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="motherName">Mother's Name</label>
                  <input 
                    type="text" 
                    id="motherName" 
                    name="motherName" 
                    value={formData.motherName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter mother's name"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="street">Street Address</label>
                  <input 
                    type="text" 
                    id="street" 
                    name="street" 
                    value={formData.street} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter street address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <Select
                    name="state"
                    options={stateOptions}
                    value={stateOptions.find(option => option.value === formData.state)}
                    onChange={handleSelectChange}
                    placeholder="Select State"
                    styles={customSelectStyles}
                    isSearchable={true}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact & Medical Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <Select
                    name="bloodGroup"
                    options={bloodGroupOptions}
                    value={bloodGroupOptions.find(option => option.value === formData.bloodGroup)}
                    onChange={handleSelectChange}
                    placeholder="Select Blood Group"
                    styles={customSelectStyles}
                    isSearchable={false}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter password"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">Register Student</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;