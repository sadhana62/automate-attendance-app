import React from "react";

export default function QRCodes({ students }) {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex flex-wrap justify-center">
        {students.map((student) => (
          <div
            key={student.id}
            className="m-3 p-4 border border-gray-300 rounded-md text-center shadow-sm bg-white"
          >
            <img
              className="w-48 h-48 mb-3 mx-auto"
              src={student.qrCodeUrl}
              alt={`QR Code for ${student.name}`}
            />
            <div className="student-name text-gray-800">{student.name}</div>
            <div className="student-id font-bold text-gray-900">{student.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
