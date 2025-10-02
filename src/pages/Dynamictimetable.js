import React, { useState } from "react";

const classes = ["Class 1", "Class 2", "Class 3"];
const sections = ["Section A", "Section B", "Section C"];
const subjects = ["Math", "Science", "English", "History", "Art"];
const teachers = ["Mr. Sharma", "Ms. Verma", "Mr. Khan", "Mrs. Roy"];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:30 PM - 1:20 PM",
  "1:30 PM - 2:30 PM"
];

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [timetable, setTimetable] = useState(
    timeSlots.map(() =>
      days.map(() => ({
        subject: "",
        teacher: ""
      }))
    )
  );

  const [showGeneratedTable, setShowGeneratedTable] = useState(false);

  const handleChange = (timeIdx, dayIdx, field, value) => {
    const newTimetable = [...timetable];
    newTimetable[timeIdx][dayIdx][field] = value;
    setTimetable(newTimetable);
  };

  const handleGenerateTemplate = () => {
    setShowGeneratedTable(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      {!showGeneratedTable && (
        <>
          <h2 style={styles.heading}>📅 Create Timetable</h2>

          {/* Class and Section Select */}
          <div style={styles.selectWrapper}>
            <div>
              <label style={styles.label}>Class: </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={styles.select}
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Section: </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={styles.select}
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <button style={styles.button} onClick={handleGenerateTemplate}>
              Generate Template
            </button>
          </div>

          {/* Timetable Grid for Input */}
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Time</th>
                {days.map((day) => (
                  <th key={day} style={styles.tableHeader}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, timeIdx) => (
                <tr key={slot}>
                  <td style={styles.timeColumn}>{slot}</td>
                  {days.map((day, dayIdx) => (
                    <td key={`${timeIdx}-${dayIdx}`} style={styles.cell}>
                      <select
                        value={timetable[timeIdx][dayIdx].subject}
                        onChange={(e) =>
                          handleChange(timeIdx, dayIdx, "subject", e.target.value)
                        }
                        style={styles.innerSelect}
                      >
                        <option value="">Subject</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <select
                        value={timetable[timeIdx][dayIdx].teacher}
                        onChange={(e) =>
                          handleChange(timeIdx, dayIdx, "teacher", e.target.value)
                        }
                        style={styles.innerSelect}
                      >
                        <option value="">Teacher</option>
                        {teachers.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Static Printable View */}
      {showGeneratedTable && (
        <div id="printArea">
          <h2 style={styles.heading}>
            📌 Final Timetable - {selectedClass} ({selectedSection})
          </h2>
          <div style={styles.buttonGroup}>
  <button onClick={handlePrint} style={styles.printBtn}>
    🖨️ Download / Print
  </button>
  <button onClick={() => setShowGeneratedTable(false)} style={styles.backBtn}>
    🔙 Back to Edit
  </button>
</div>


          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Time</th>
                {days.map((day) => (
                  <th key={day} style={styles.tableHeader}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, timeIdx) => (
                <tr key={slot}>
                  <td style={styles.timeColumn}>{slot}</td>
                  {days.map((_, dayIdx) => {
                    const entry = timetable[timeIdx][dayIdx];
                    return (
                      <td key={`${timeIdx}-${dayIdx}`} style={styles.cell}>
                        <div><strong>{entry.subject}</strong></div>
                        <div>{entry.teacher}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 💅 Styles
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f8fc",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "100vh",
  },
  heading: {
    color: "#dd3b12ff",
    textAlign: "center",
    marginBottom: "30px",
  },
  selectWrapper: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginRight: "8px",
    fontWeight: "bold",
    color: "#333",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "14px",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#df6d10ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "20px",
  },
  printBtn: {
    padding: "8px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "block",
    margin: "0 auto 20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  tableHeaderRow: {
    backgroundColor: "#c46f0dff",
    color: "#fff",
  },
  tableHeader: {
    padding: "12px",
    fontWeight: "bold",
    border: "1px solid #ddd",
  },
  timeColumn: {
    padding: "10px",
    fontWeight: "600",
    backgroundColor: "#ecf0f1",
    border: "1px solid #ddd",
  },
  cell: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#fdfefe",
  },
  innerSelect: {
    width: "100%",
    marginBottom: "6px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "13px",
  },
  backBtn: {
  padding: "8px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  marginLeft: "15px",
},

buttonGroup: {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginBottom: "20px",
},

};

export default Timetable;
