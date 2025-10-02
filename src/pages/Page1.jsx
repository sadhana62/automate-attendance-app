 import React from "react";
import StudentTable from "./StudentTable";

const Page1 = () => {
  const students = [
    { roll: 1, name: "Aarav Kumar", interest: "Music" },
    { roll: 2, name: "Priya Singh", interest: "Science" },
    { roll: 3, name: "Rohan Verma", interest: "Sports" },
    { roll: 4, name: "Anjali Sharma", interest: "Art & Painting" },
    { roll: 5, name: "kajal", interest: "Music" },
    { roll: 6, name: "Priya maurya", interest: "Science" },
    { roll: 7, name: "Rohit sharma", interest: "Sports" },
    { roll: 8, name: "Anshika singh", interest: "Art & Painting" },
    { roll: 9, name: "Aarav Kumar", interest: "Music" },
    { roll: 10, name: "Priya Singh", interest: "Science" },
  ];

  return <StudentTable students={students} title="⏰ Free Time" />;
};

export default Page1;
