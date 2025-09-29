// src/pages/SchoolLoginPage.js
import React, { useState } from "react";

const SchoolLoginPage = () => {
  const [role, setRole] = useState("admin"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Login attempt:", { role, email, password });

    // Example backend call
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (data.role === "teacher") {
          window.location.href = "/teacher/dashboard";
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}>
        {/* Replace with school image/illustration */}
        <img
          src="/assets/school.jpg" alt="School Login"
          style={styles.image}
        />
      </div>
      <div style={styles.rightPane}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>School Login</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role</label>
              <select
                style={styles.input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={styles.button}>
              Log In
            </button>
          </form>
          <div style={styles.footerText}>
            <a href="#" style={styles.link}>Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Light theme styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  leftPane: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width:"70%"
  },
  image: {
    maxWidth: "70%",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  rightPane: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width:"30%"
  },
  formContainer: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    width: "350px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "24px",
    color: "#222",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#444",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  footerText: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default SchoolLoginPage;
