import React, { useState, useEffect } from 'react';
import './addClass.css';

function AddClass() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState('');
  const [newSection, setNewSection] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/classes/complete');
      const data = await response.json();
      if (data.success) {
        setClasses(data.classes);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching classes');
      console.error('Error fetching classes:', error);
    }
  };

  const handleAddClass = async () => {
    if (newClass.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3000/api/class', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ class: newClass }),
        });
        const data = await response.json();
        if (data.success) {
          setClasses([...classes, { id: data.class_id, name: newClass, sections: [], subjects: [] }]);
          setNewClass('');
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error adding class');
        console.error('Error adding class:', error);
      }
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/class/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        const updatedClasses = classes.filter(cls => cls.id !== id);
        setClasses(updatedClasses);
        setSelectedClass(null);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error deleting class');
      console.error('Error deleting class:', error);
    }
  };

  const handleAddSection = async () => {
    if (selectedClass !== null && newSection.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3000/api/section', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ class_id: classes[selectedClass].id, section: newSection }),
        });
        const data = await response.json();
        if (data.success) {
          const updatedClasses = [...classes];
          updatedClasses[selectedClass].sections.push({ id: data.section_id, name: newSection });
          setClasses(updatedClasses);
          setNewSection('');
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error adding section');
        console.error('Error adding section:', error);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/section/${sectionId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        const updatedClasses = [...classes];
        updatedClasses[selectedClass].sections = updatedClasses[selectedClass].sections.filter(
          section => section.id !== sectionId
        );
        setClasses(updatedClasses);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error deleting section');
      console.error('Error deleting section:', error);
    }
  };


 

  const handleAddSubject = async () => {
    if (selectedClass !== null && newSubject.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3000/api/subject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ class_id: classes[selectedClass].id, subject: newSubject }),
        });
        const data = await response.json();
        if (data.success) {
          const updatedClasses = [...classes];
          updatedClasses[selectedClass].subjects.push({ id: data.subject_id, name: newSubject });
          setClasses(updatedClasses);
          setNewSubject('');
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error adding subject');
        console.error('Error adding subject:', error);
      }
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subject/${subjectId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        const updatedClasses = [...classes];
        updatedClasses[selectedClass].subjects = updatedClasses[selectedClass].subjects.filter(
          subject => subject.id !== subjectId
        );
        setClasses(updatedClasses);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error deleting subject');
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div className="class-management">
      <h2>Class Management</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <h3>Add New Class</h3>
        <div className="form-group">
          <label htmlFor="newClass">Class Name</label>
          <input
            type="text"
            id="newClass"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Enter new class name"
          />
        </div>
        <button onClick={handleAddClass}>Add Class</button>
      </div>

      <div className="form-section">
        <h3>Classes</h3>
        <div className="class-list">
          {classes.map((cls, index) => (
            <div key={cls.id} className="class-item">
              <span>{cls.name}</span>
              <div>
                <button onClick={() => setSelectedClass(index)}>Manage</button>
                <button onClick={() => handleDeleteClass(cls.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedClass !== null && (
        <div className="form-section">
          <h3>Manage {classes[selectedClass].name}</h3>
          <div className="form-group">
            <label htmlFor="newSection">New Section</label>
            <input
              type="text"
              id="newSection"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="Enter new section name"
            />
            <button onClick={handleAddSection}>Add Section</button>
          </div>
          <div className="form-group">
            <label htmlFor="newSubject">New Subject</label>
            <input
              type="text"
              id="newSubject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter new subject name"
            />
            <button onClick={handleAddSubject}>Add Subject</button>
          </div>
          <div className="section-list">
            <h4>Sections:</h4>
            {classes[selectedClass].sections.map((section) => (
              <div key={section.id} className="section-item">
                <span>{section.name}</span>
                <button onClick={() => handleDeleteSection(section.id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="subject-list">
            <h4>Subjects:</h4>
            {classes[selectedClass].subjects.map((subject) => (
              <div key={subject.id} className="subject-item">
                <span>{subject.name}</span>
                <button onClick={() => handleDeleteSubject(subject.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddClass;