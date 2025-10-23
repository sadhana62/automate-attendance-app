import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Timetable = () => {
  const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];
  const sections = ["Section A", "Section B", "Section C"];
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const defaultSubjects = [
    { id: "1", subject: "Math", teacher: "Mr. Smith", room: "101" },
    { id: "2", subject: "Science", teacher: "Ms. Johnson", room: "102" },
    { id: "3", subject: "English", teacher: "Mrs. Lee", room: "103" },
  ];

  const defaultSlots = [
    { start: "9:00 AM", end: "10:00 AM" },
    { start: "10:00 AM", end: "11:00 AM" },
    { start: "11:00 AM", end: "12:00 PM" },
    { start: "12:00 PM", end: "12:30 PM" },
    { start: "12:30 PM", end: "1:00 PM" },
    { start: "1:00 PM", end: "2:00 PM" },
  ];

  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [timeSlots] = useState(defaultSlots);

  const [schedule, setSchedule] = useState(() => {
    const initial = {};
    weekdays.forEach((day) => {
      defaultSlots.forEach((slot) => {
        const timeLabel = `${slot.start} - ${slot.end}`;
        initial[`${day}-${timeLabel}`] = [];
      });
    });
    return initial;
  });

  const [availableSubjects] = useState(defaultSubjects);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceKey = source.droppableId;
    const destKey = destination.droppableId;

    const sourceItems = Array.from(schedule[sourceKey]);
    const [movedItem] = sourceItems.splice(source.index, 1);

    const destItems = Array.from(schedule[destKey]);
    destItems.splice(destination.index, 0, movedItem);

    setSchedule((prev) => ({
      ...prev,
      [sourceKey]: sourceItems,
      [destKey]: destItems,
    }));
  };

  const styles = {
    container: {
      fontFamily: "Segoe UI, sans-serif",
      padding: "20px",
      background: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
      minHeight: "100vh",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "15px",
      textAlign: "center",
      color: "#333",
    },
    selectors: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      marginBottom: "20px",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      fontSize: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "8px",
    },
    th: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "12px",
      borderRadius: "8px",
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
    td: {
      border: "1px solid #ddd",
      borderRadius: "12px",
      minHeight: "120px",
      verticalAlign: "top",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(5px)",
      padding: "8px",
      transition: "0.3s",
    },
    tdHover: {
      backgroundColor: "rgba(230, 247, 255, 0.9)",
    },
    item: {
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "10px",
      marginBottom: "6px",
      fontSize: "14px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      transition: "transform 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.heading}>📚 Timetable for Students </div>

      <div style={styles.selectors}>
        <select
          style={styles.select}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((cls) => (
            <option key={cls}>{cls}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          {sections.map((sec) => (
            <option key={sec}>{sec}</option>
          ))}
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>⏰ Time</th>
              {weekdays.map((day) => (
                <th style={styles.th} key={day}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, idx) => {
              const timeLabel = `${slot.start} - ${slot.end}`;
              return (
                <tr key={idx}>
                  <td style={styles.td}>
                    <b>{slot.start}</b> - {slot.end}
                  </td>
                  {weekdays.map((day) => {
                    const key = `${day}-${timeLabel}`;
                    return (
                      <td key={key} style={styles.td}>
                        <Droppable droppableId={key}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{ minHeight: "100px" }}
                            >
                              {schedule[key].map((item, index) => (
                                <Draggable
                                  draggableId={item.id}
                                  index={index}
                                  key={item.id}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...styles.item,
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <strong>{item.subject}</strong>
                                      <div style={{ fontSize: "12px", color: "#555" }}>
                                        {item.teacher} • Room {item.room}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <h3 style={{ marginTop: "30px", color: "#333" }}>🎯 Available Subjects</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Droppable droppableId="available">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  minHeight: "120px",
                  border: "2px dashed #007bff",
                  borderRadius: "12px",
                  padding: "15px",
                  background: "rgba(255,255,255,0.8)",
                  flex: 1,
                }}
              >
                {availableSubjects.map((item, index) => (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...styles.item,
                          ...provided.draggableProps.style,
                          cursor: "grab",
                        }}
                      >
                        <strong>{item.subject}</strong>
                        <div style={{ fontSize: "12px", color: "#555" }}>
                          {item.teacher} • Room {item.room}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Timetable;


