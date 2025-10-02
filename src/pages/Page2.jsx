 import React from "react";
import StudentTable from "./StudentTable";

const Page2 = () => {
  const students = [
    { roll: 11, name: "Vikas Yadav", interest: "Music" },
    { roll: 12, name: "Anushka", interest: "Swimming" },
    { roll: 13, name: "Priya Kumari", interest: "Science" },
    { roll: 14, name: "Sadhna", interest: "Sports" },
    { roll: 15, name: "Priya Singh", interest: "Science" },
    { roll: 16, name: "Priya maurya", interest: "Science" },
    { roll: 17, name: "Rohit sharma", interest: "Sports" },
    { roll: 18, name: "Anshika singh", interest: "Art & Painting" },
    { roll: 19, name: "Aarav Kumar", interest: "Music" },
    { roll: 20, name: "Priya Singh", interest: "Science" },
  ];

  return <StudentTable students={students} title="⏰ Free Time" />;
};

export default Page2;
