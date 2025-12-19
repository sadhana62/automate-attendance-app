import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/library";

export default function AttendancePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState(null);
  const [seatNumber, setSeatNumber] = useState(null);
  const [autoMode, setAutoMode] = useState(false);
  const [verificationCount, setVerificationCount] = useState(0);
  const autoIntervalRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        window.stream = s; // Assign stream to global window object
        if (video) {
          video.srcObject = s;
          initQRScanner();
        }
      })
      .catch((err) => {
        showMessage("Error accessing camera: " + err.message, 'error');
      });

    return () => {
      stopAutoMode();
      if (video?.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        window.stream = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  const initQRScanner = () => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
      if (result) {
        const qrContent = result.getText();
        let sid = extractStudentId(qrContent);
        if (sid) {
          setStudentId(sid);
          showMessage("QR Code detected. Starting attendance verification...", "success");
          startAttendanceVerification();
        } else {
          showMessage("Invalid QR Code format.", "error");
        }
      }
    });
  };

  const extractStudentId = (qrContent) => {
    try {
      const data = JSON.parse(qrContent);
      if (data.type === "student" && data.id) {
        return data.id;
      }
    } catch (e) {
      console.warn("QR is not valid JSON:", qrContent);
      return null;
    }
    return null;
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
  };

  const startAttendanceVerification = () => {
    if (!autoMode) verifyAttendance();
  };

  const toggleAutoMode = () => {
    if (autoMode) {
      stopAutoMode();
    } else {
      setAutoMode(true);
      setVerificationCount(0);
      autoIntervalRef.current = setInterval(verifyAttendance, 3000);
    }
  };

  const stopAutoMode = () => {
    setAutoMode(false);
    clearInterval(autoIntervalRef.current);
    setVerificationCount(0);
  };

  const verifyAttendance = async () => {
    if (!studentId) {
      // showMessage("Please enter a Student ID or show a QR code", "error");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("sid", studentId);
        formData.append("image", blob, "attendance.jpg");

        try {
          showMessage(`Verifying attendance... (Attempt ${verificationCount + 1}/5)`, "auto-mode");
          const response = await fetch("http://localhost:3000/verify-attendance", { method: "POST", body: formData });
          const data = await response.json();

          if (data.success) {
            showMessage(`✅ ${data.message}`, "success");
            // After successful attendance verification, request a seat assignment
            try {
              const seatRes = await fetch("http://localhost:3000/assign-seat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId })
              });
              const seatData = await seatRes.json();
              if (seatData.success) {
                setSeatNumber(seatData.seat);
                showMessage(`✅ ${data.message} — Seat: ${seatData.seat}`, "success");
              } else {
                // Could not assign a seat; still show attendance success
                setSeatNumber(null);
                showMessage(`✅ ${data.message} — ${seatData.message || 'Seat not assigned'}`, "success");
              }
            } catch (err) {
              console.error('Error assigning seat:', err);
              showMessage(`✅ ${data.message} — seat assignment failed`, "success");
            }

            setVerificationCount((prev) => {
              if (prev + 1 >= 5) stopAutoMode();
              return prev + 1;
            });
          } else {
            showMessage(` ${data.message}`, "error");
          }
        } catch (error) {
          showMessage(" Verification failed: " + error.message, "error");
        }
      }
    }, "image/jpeg", 0.8);
  };

  // --- Enhanced UI Styles ---
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI, Arial, sans-serif",
  };
  const cardStyle = {
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    padding: "2.5rem 2rem",
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
  };
  const titleStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#1b263b",
    letterSpacing: "1px",
  };
 
  const labelStyle = {
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    color: "#495057",
    textAlign: "left",
  };
  const inputStyle = {
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #bfc9d1",
    borderRadius: "8px",
    width: "100%",
    marginBottom: "1.2rem",
    outline: "none",
    transition: "border 0.2s",
  };
  const buttonStyle = {
    padding: "12px 28px",
    fontSize: "1rem",
    background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
    color: "#1b263b",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    margin: "0 8px",
    boxShadow: "0 2px 8px rgba(67,233,123,0.08)",
    transition: "background 0.2s, color 0.2s",
  };
  const buttonActiveStyle = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
    color: "#fff",
  };
  const videoStyle = {
    border: "3px solid #43e97b",
    borderRadius: "16px",
    margin: "1.2rem 0",
    width: "100%",
    maxWidth: 350,
    boxShadow: "0 4px 16px rgba(67,233,123,0.10)",
  };
  const messageStyle = {
    margin: "18px 0 0 0",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: "1rem",
    border: "1px solid",
    display: "inline-block",
    minWidth: 200,
  };
  const messageTypeStyle = {
    success: {
      background: "#e6f9ed",
      color: "#20734d",
      borderColor: "#b7e4c7",
    },
    error: {
      background: "#ffeaea",
      color: "#b02a37",
      borderColor: "#f5c6cb",
    },
    "auto-mode": {
      background: "#fffbe6",
      color: "#856404",
      borderColor: "#ffeaa7",
    },
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>Mark Attendance</div>
       

        <form
          onSubmit={e => {
            e.preventDefault();
            verifyAttendance();
          }}
          style={{ marginBottom: "1.5rem" }}
        >
          <label style={labelStyle}>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            placeholder="Enter Student ID or show QR code"
            style={inputStyle}
          />
        </form>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="350"
          height="260"
          style={videoStyle}
        ></video>
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div style={{ margin: "1.2rem 0" }}>
          <button
            onClick={verifyAttendance}
            style={buttonStyle}
          >
            Verify Attendance
          </button>
          <button
            onClick={toggleAutoMode}
            style={autoMode ? buttonActiveStyle : buttonStyle}
          >
            {autoMode ? "Stop Auto Mode" : "Start Auto Mode"}
          </button>
        </div>

        {message && (
          <div
            style={{
              ...messageStyle,
              ...(messageTypeStyle[message.type] || messageTypeStyle["auto-mode"]),
            }}
          >
            {message.text}
          </div>
        )}
        {seatNumber && (
          <div style={{ marginTop: 12, fontWeight: 700, color: '#1b263b' }}>
            Assigned Seat: {seatNumber}
          </div>
        )}
      </div>
    </div>
  );
}
