// src/App.js
import React, { useState, useEffect } from 'react';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
// import Timetable from './pages/Timetable';
// import AddTeacherForm from './pages/AddTeacherForm'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
//import Card from '@mui/material/Card';
import StudentTable from './pages/StudentTable';

//import Page1 from './pages/Page1';
//import Page2 from './pages/Page2';
//import Page3 from './pages/Page3';
//import "./Teacher_table.css";

//import TeacherTimetable from "./TeacherTimetable/TeacherTimetable";
import TeacherDashboard from "./TeacherTimetable/TeacherDashboard";





// const App = () => {
//   const [page, setPage] = useState(1);
//   const [active, setActive] = useState(true);

//   useEffect(() => {
//     if (!active) return;

//     // change page every 3 seconds
//     const interval = setInterval(() => {
//       setPage((prevPage) => (prevPage % 3) + 1);
//     }, 3000);

//     // stop after 3 minutes total
//     const timeout = setTimeout(() => {
//       setActive(false);
//       clearInterval(interval);
//     }, 180000); // 3 minutes = 180000 ms

//     return () => {
//       clearInterval(interval);
//       clearTimeout(timeout);
//     };
//   }, [active]);

//   return (
//     <div>
//       {active ? (
//         <>
//           {page === 1 && <Page1 />}
//           {page === 2 && <Page2 />}
//           {page === 3 && <Page3 />}
//         </>
//       ) : (
//         <h2 style={{ textAlign: "center", marginTop: "50px" }}>
//           ⏱️ Time is over !
//         </h2>
//       )}
//     </div>
//   );
// };
function App() {
  return (
    <div>
      <TeacherDashboard />
    </div>
  );
}

export default App;
