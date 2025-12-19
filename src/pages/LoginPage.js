import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        // Store user info for other parts of the app
        localStorage.setItem('user', JSON.stringify({ username, role: data.role }));
        // If teacher, also store username separately for teacher pages
        if (data.role === 'teacher') {
          try { localStorage.setItem('username', username); } catch (e) {}
        }
        // If admin, mark admin logged in (used by admin dashboard)
        if (data.role === 'admin') {
          try { localStorage.setItem('isAdminLoggedIn', 'true'); } catch (e) {}
        }

        if (data.role === 'admin') {
          navigate("/admindashBoard");
        } else if (data.role === 'teacher') {
          // Navigate to the new teacher dashboard
          navigate("/teacherdashboard");
        }

      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error");
    }
  };
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "white",
    fontFamily: "Georgia",
  };

  const cardStyle = {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    overflow: "hidden",
    width: "850px",
    maxWidth: "100%",
  };

  const leftStyle = {
    width: "50%",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const rightStyle = {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px",
  };

  const headingStyle = {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "40px",
  };

  const labelStyle = {
    fontSize: "18px",
    marginBottom: "5px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    border: "none",
    borderBottom: "1px solid #999",
    outline: "none",
    padding: "10px 10px",
    fontSize: "16px",
    marginBottom: "25px",
  };

  const buttonStyle = {
    backgroundColor: "green",
    border: "none",
    color: "white",
    padding: "12px",
    borderRadius: "15px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    width:"100px"
  };

  const footerStyle = {
    textAlign: "right",
    marginTop: "25px",
    color: "gray",
    fontSize: "14px",
  };
   const errorStyle = {
    background: "#ffdddd",
    color: "#a94442",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold",
  };

  // New styles for radio buttons
  const radioGroupStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "25px",
  };

  const radioLabelStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
  };

  const radioInputStyle = {
    marginRight: "10px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Left image */}
        <div style={leftStyle}>
          <img
            src="./assets/unnamed.webp"
            alt="Login Visual"
            style={imgStyle}
          />
        </div>

        {/* Right form */}
        <div style={rightStyle}>
          <h2 style={headingStyle}>Login Here</h2>

           {/* New radio buttons for role selection */}
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  style={radioInputStyle}
                />
                Admin
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={() => setRole("teacher")}
                  style={radioInputStyle}
                />
                Teacher
              </label>
            </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>UserName:</label>
            <input type="input" style={inputStyle} onChange={e => setUsername(e.target.value)}  required/>

            <label style={labelStyle}>Password:</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={inputStyle}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor="showPassword" style={{ fontSize: '14px', color: 'gray' }}>Show Password</label>
            </div>
           

            <button type="submit" style={buttonStyle}>
              Login
            </button>
            {error && (
              <div style={errorStyle}>
                {error === "Invalid credentials"
                  ? "Wrong username or password."
                  : error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}