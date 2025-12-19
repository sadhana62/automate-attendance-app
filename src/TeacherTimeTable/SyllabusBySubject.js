import React, { useEffect, useState } from 'react';
import './SyllabusBySubject.css';

export default function SyllabusBySubject() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes/complete');
        const data = await res.json();
        if (data.success) setClasses(data.classes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchForClass = async () => {
      setLoading(true);
      setError(null);
      try {
        // try to find subjects from classes payload (if available)
        const cls = classes.find(c => String(c.id) === String(selectedClass));
        setSubjects(cls?.subjects || []);

        const res = await fetch(`http://localhost:3000/api/syllabus/${selectedClass}`);
        if (res.ok) {
          const d = await res.json();
          console.log("d",d);
          if (d.success) setSyllabus(d.syllabus || null);
          else setSyllabus(null);
        } else {
          setSyllabus(null);
        }
      } catch (err) {
        setError(err.message || 'Failed');
      } finally {
        setLoading(false);
      }
    };
    fetchForClass();
  }, [selectedClass, classes]);

  return (
    <div className="syllabus-page">
      <div className="syllabus-card">
        <h2 className="syllabus-heading">Syllabus - Subject Wise</h2>

        <div className="syllabus-controls">
          <label className="syllabus-label">Select Class</label>
          <select className="syllabus-select" value={selectedClass || ''} onChange={e => setSelectedClass(e.target.value)}>
            <option value="">-- Choose class --</option>
            {/* Always offer class range 1..12 for quick selection */}
            {[...Array(12)].map((_, i) => {
              const clsNum = i + 1;
              return <option key={clsNum} value={clsNum}>Class {clsNum}</option>;
            })}
            {/* Also include any classes fetched from API for richer labels (avoid duplicates) */}
            {classes.map(c => (
              // if API provided class id/name not in 1..12 range, include it
              ![...Array(12)].map((_, i) => String(i + 1)).includes(String(c.id)) && (
                <option key={c.id} value={c.id}>{c.name || `Class ${c.id}`}</option>
              )
            ))}
          </select>
        </div>

        {loading && <div className="syllabus-info">Loading...</div>}
        {error && <div className="syllabus-error">{error}</div>}

        {selectedClass && !loading && (
          <div className="syllabus-body">
            <div className="syllabus-meta">
             

              <div className="syllabus-meta">
                <h3>Class Syllabus</h3>
                {syllabus ? (
                  <div className="syllabus-file">
                    <div className="file-name">{syllabus.original_name}</div>
                    <div className="file-meta">Uploaded: {syllabus.uploaded_at}</div>
                    <a className="download-btn" href={`http://localhost:3000/uploads/${syllabus.filename}`} target="_blank" rel="noreferrer">Download PDF</a>
                  </div>
                ) : (
                  <div className="no-syllabus">Syllabus yet to be implemented.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
