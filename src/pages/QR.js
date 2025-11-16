import React, { useEffect, useState } from "react";

export default function QR() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/qr")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch students:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading QR codes...</div>;
  }

  return (
    <div>
      {/* INLINE CSS */}
      <style>{`
        .qr-container {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
          padding: 20px;
        }

        .qr-card {
          width: 200px;
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
          text-align: center;
          transition: transform 0.2s ease;
        }

        .qr-card:hover {
          transform: scale(1.05);
        }

        .qr-card img {
          width: 150px;
          height: 150px;
          object-fit: contain;
          margin: auto;
        }
      `}</style>

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          All Students QR Codes
        </h1>

        <div className="qr-container">
          {students.map((student) => (
            <div key={student.id} className="qr-card">
              <div className="qr mb-3">
                <img src={student.qr} alt={`QR for ${student.name}`} />
              </div>
              <div className="name font-semibold text-lg">{student.name}</div>
              <div className="id text-sm text-gray-600 mb-3">ID: {student.id}</div>
              <a
                href={student.qr}
                download={`student_${student.id}.png`}
                className="inline-block px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
