 import React from "react";
import StudentTable from "./StudentTable";

const Page3 = () => {
  const students = [
    { roll: 21, name: "Raj Singh", interest: "Art & Painting" },
    { roll: 22, name: "Adarsh Kumar", interest: "Music" },
    { roll: 23, name: "Sneha Sharma", interest: "Science" },
    { roll: 24, name: "Amit Verma", interest: "Sports" },
    { roll: 25, name: "Priya maurya", interest: "Science" },
    { roll: 26, name: "Rohit sharma", interest: "Sports" },
    { roll: 27, name: "Anshika singh", interest: "Art & Painting" },
    { roll: 28, name: "Aarav Kumar", interest: "Music" },
    { roll: 29, name: "Priya Singh", interest: "Science" },
    { roll: 30, name: "Priya Singh", interest: "Science" },
  ];

  return <StudentTable students={students} title="⏰ Free Time" />;
};

export default Page3;
