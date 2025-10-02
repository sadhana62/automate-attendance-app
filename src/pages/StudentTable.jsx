 import React from "react";
import "./StudentTable.css";


const StudentTable = ({ students, title }) => {
  return (
    <div className="student-container">
      <h1 className="student-heading">{title}</h1>

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Field of Interest</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.roll}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{student.roll}</td>
                <td>{student.name}</td>
                <td>{student.interest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
