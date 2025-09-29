// src/pages/RegisterPage.js
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎥 Start webcam when component mounts
  useEffect(() => {
    const video = videoRef.current;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          showMessage("📹 Camera ready! Enter Student ID and click 'Capture & Register'", "loading");
          console.log(`Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
        };
      })
      .catch((err) => {
        showMessage("❌ Error accessing camera: " + err.message, "error");
        console.error("Camera error:", err);
      });

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const captureImage = () => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        showMessage("❌ Video not ready. Please wait for camera to initialize.", "error");
        resolve(null);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size > 0) {
            console.log(`Image captured: ${blob.size} bytes, type: ${blob.type}`);
            resolve(blob);
          } else {
            console.error("Failed to capture image or empty blob");
            showMessage("❌ Failed to capture image. Please try again.", "error");
            resolve(null);
          }
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const testUpload = async () => {
    const sid = studentId.trim() || "TEST001";
    showMessage("🧪 Testing image capture and upload...", "loading");

    try {
      const blob = await captureImage();
      if (!blob) return;

      const formData = new FormData();
      formData.append("sid", sid);
      formData.append("image", blob, `${sid}_test.jpg`);

      const response = await fetch("http://localhost:5000/test-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        showMessage(`✅ Test successful! File size: ${data.fileSize} bytes`, "success");
      } else {
        showMessage(`❌ Test failed: ${data.message}`, "error");
      }
      console.log("Test response:", data);
    } catch (error) {
      showMessage("❌ Test error: " + error.message, "error");
      console.error("Test error:", error);
    }
  };

  const captureAndRegister = async () => {
    if (!studentId.trim()) {
      showMessage("⚠️ Please enter a Student ID", "error");
      return;
    }

    setLoading(true);
    showMessage("📸 Capturing image...", "loading");

    try {
      const blob = await captureImage();
      if (!blob) return;

      const formData = new FormData();
      formData.append("sid", studentId.trim());
      formData.append("image", blob, `${studentId.trim()}_registration.jpg`);

      showMessage("🔄 Registering student... Please wait (30–60s)", "loading");

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      console.log("Registration response:", data);

      if (data.success) {
        showMessage(`✅ Success! ${data.message}`, "success");
        setStudentId("");
      } else {
        showMessage(`❌ Registration failed: ${data.message}`, "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showMessage("❌ Network error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Styles
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "700px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      textAlign: "center",
    },
    innerBox: {
      background: "white",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    header: {
      background: "green",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "30px",
    },
    backLink: {
      display: "inline-block",
      marginBottom: "20px",
      color: "#007bff",
      textDecoration: "none",
      fontWeight: "bold",
    },
    formGroup: { margin: "25px 0" },
    label: { display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" },
    input: {
      padding: "12px",
      fontSize: "16px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      width: "250px",
      transition: "border-color 0.3s",
    },
    video: {
      border: "3px solid #007bff",
      borderRadius: "15px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      margin: "20px 0",
    },
    button: {
      padding: "12px 25px",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      margin: "10px",
      transition: "background-color 0.3s",
    },
    primaryBtn: { backgroundColor: "#007bff", color: "white" },
    testBtn: { backgroundColor: "#6c757d", color: "white" },
    messageBox: {
      margin: "20px 0",
      padding: "15px",
      borderRadius: "8px",
      fontWeight: "bold",
    },
    success: { backgroundColor: "#d4edda", color: "#155724", border: "2px solid #c3e6cb" },
    error: { backgroundColor: "#f8d7da", color: "#721c24", border: "2px solid #f5c6cb" },
    loading: { backgroundColor: "#fff3cd", color: "#856404", border: "2px solid #ffeaa7" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        <Link to="/admindashBoard" style={styles.backLink}>
          ← Back to Home
        </Link>

        <div style={styles.header}>
          <h1>👤 Student Registration</h1>
          <p>Register a new student for face recognition attendance</p>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="studentId" style={styles.label}>
            Student ID:
          </label>
          <input
            type="text"
            id="studentId"
            style={styles.input}
            placeholder="Enter Student ID (e.g., STU001)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") captureAndRegister();
            }}
          />
        </div>

        <video ref={videoRef} autoPlay playsInline width="400" height="300" style={styles.video}></video>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        <div style={styles.formGroup}>
          <button
            style={{ ...styles.button, ...styles.primaryBtn }}
            onClick={captureAndRegister}
            disabled={loading}
          >
            {loading ? "Processing..." : "📸 Capture & Register"}
          </button>
          <button style={{ ...styles.button, ...styles.testBtn }} onClick={testUpload}>
            🧪 Test Upload
          </button>
        </div>

        {message && (
          <div
            style={{
              ...styles.messageBox,
              ...(messageType === "success"
                ? styles.success
                : messageType === "error"
                ? styles.error
                : styles.loading),
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
