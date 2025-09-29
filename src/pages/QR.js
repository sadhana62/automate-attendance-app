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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        All Students QR Codes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center" style={{"display":"flex"}}>
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white border border-gray-300 rounded-xl p-4 text-center shadow-md hover:scale-105 transition-transform"
          >
            <div className="qr mb-3">
              <img
                src={student.qr}
                alt={`QR Code for ${student.name}`}
                className="w-36 h-36 mx-auto"
              />
            </div>
            <div className="name font-semibold text-lg text-gray-900">
              {student.name}
            </div>
            <div className="id text-sm text-gray-600 mb-3">ID: {student.id}</div>
            <a
              className="download-btn inline-block px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              href={student.qr}
              download={`student_${student.id}.png`}
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}