import React, { useState, useEffect } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:30 PM - 1:20 PM",
  "1:30 PM - 2:30 PM"
];

const Timetable = ({ classes = [], sections = [], subjects = [], teachers = [] }) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [filteredSections, setFilteredSections] = useState([]);

  const [timetable, setTimetable] = useState(
    timeSlots.map(() =>
      days.map(() => ({
        subject: "",
        teacher: ""
      }))
    )
  );

  const [showGeneratedTable, setShowGeneratedTable] = useState(false);

  useEffect(() => {
    if (selectedClassId) {
      const relevantSections = sections.filter(s => s.class_id === parseInt(selectedClassId, 10));
      setFilteredSections(relevantSections);
      setSelectedSection(relevantSections[0]?.name || '');
    } else {
      setFilteredSections([]);
      setSelectedSection('');
    }
  }, [selectedClassId, sections]);

  const selectedClassName = classes.find(c => c.id === parseInt(selectedClassId, 10))?.name || '';

  const handleChange = (timeIdx, dayIdx, field, value) => {
    const newTimetable = [...timetable];
    newTimetable[timeIdx][dayIdx][field] = value;
    setTimetable(newTimetable);
  };

  const handleGenerateTemplate = async () => {
    if (!selectedClassId || !selectedSection) {
      alert("Please select a class and section first.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: selectedClassId,
          section_name: selectedSection,
          timetable_data: timetable,
        }),
      });
      const data = await response.json();
      alert(data.message);
      if (!data.success) return;
    } catch (error) {
      alert("An error occurred while saving the timetable.");
    }
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
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={styles.select}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
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
                {filteredSections.map((sec) => (
                  <option key={sec.id} value={sec.name}>
                    {sec.name}
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
            📌 Final Timetable - {selectedClassName} ({selectedSection})
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
                    const entry = timetable[timeIdx]?.[dayIdx] || { subject: '', teacher: '' };
                    return (
                      <td key={`${timeIdx}-${dayIdx}`} style={styles.cell}>
                        <div><strong>{entry.subject || '-'}</strong></div>
                        <div style={{fontSize: '12px', color: '#555'}}>{entry.teacher || ''}</div>
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
  justifyContent: "center", // This will center the buttons horizontally
  gap: "15px",
  marginBottom: "20px",
},

};

export default Timetable;
