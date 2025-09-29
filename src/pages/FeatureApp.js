// src/components/FeatureApp.js
import React from "react";
import { Link } from "react-router-dom";

function FeatureApp() {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      textAlign: "center",
    },
    title: {
      color: "#333",
      marginBottom: "40px",
    },
    options: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    optionCard: {
      display: "inline-block",
      margin: "20px",
      padding: "30px",
      border: "2px solid #007bff",
      borderRadius: "10px",
      textDecoration: "none",
      color: "#007bff",
      transition: "all 0.3s",
    },
    optionCardHover: {
      backgroundColor: "#007bff",
      color: "white",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Face Recognition Attendance System</h1>

      <div style={styles.options}>
        <Link
          to="/register"
          style={styles.optionCard}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#007bff";
          }}
        >
          <h3>Register Student</h3>
          <p>Enroll a new student with face recognition</p>
        </Link>

        <Link
          to="/attendance"
          style={styles.optionCard}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#007bff";
          }}
        >
          <h3>Mark Attendance</h3>
          <p>Verify student and mark attendance</p>
        </Link>
      </div>
    </div>
  );
}

export default FeatureApp;
