import React, { useState } from "react";
import "./RegistrationForm.css";

export default function AdminHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddHoliday = (e) => {
    e.preventDefault();
    if (!date || !name) {
      setMessage("Please provide both date and name.");
      return;
    }
    setHolidays((prev) => [...prev, { date, name }]);
    setDate("");
    setName("");
    setMessage("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const nameLower = file.name.toLowerCase();

    // Handle JSON files
    if (nameLower.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.map((p) => ({ date: p.date, name: p.name })).filter((p) => p.date && p.name);
            if (cleaned.length) setHolidays((prev) => [...prev, ...cleaned]);
          }
        } catch (err) {
          setMessage('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
      return;
    }

    // Handle CSV files
    if (nameLower.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target.result;
          const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          if (lines.length === 0) return;
          let start = 0;
          const first = lines[0].split(',').map((c) => c.toLowerCase());
          if (first.includes('name') && first.includes('date')) start = 1;
          const parsed = [];
          for (let i = start; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length >= 2) {
              const n = cols[0].trim();
              const d = cols[1].trim();
              if (n && d) parsed.push({ name: n, date: d });
            }
          }
          if (parsed.length) setHolidays((prev) => [...prev, ...parsed]);
        } catch (err) {
          setMessage('Failed to parse CSV file.');
        }
      };
      reader.readAsText(file);
      return;
    }

    // Handle Excel files (.xlsx, .xls) — read as array buffer and use xlsx parser
    if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
      try {
        // Prefer modern Browser API
        const arrayBuffer = await file.arrayBuffer();
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          setMessage('Excel file has no sheets.');
          return;
        }
        const sheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        const parsed = [];
        rows.forEach((row) => {
          // Try to detect name/date columns (case-insensitive)
          const keys = Object.keys(row);
          let nameVal = '';
          let dateVal = '';
          for (const k of keys) {
            const kl = k.toLowerCase();
            if (!nameVal && kl.includes('name')) nameVal = row[k];
            if (!dateVal && kl.includes('date')) dateVal = row[k];
          }
          // fallback to first two columns
          if (!nameVal && keys[0]) nameVal = row[keys[0]];
          if (!dateVal && keys[1]) dateVal = row[keys[1]];
          if (nameVal && dateVal) parsed.push({ name: String(nameVal).trim(), date: formatDate(dateVal) });
        });
        if (parsed.length) setHolidays((prev) => [...prev, ...parsed]);
        return;
      } catch (err) {
        console.error(err);
        setMessage('Failed to parse Excel file. Install `xlsx` and try again.');
        return;
      }
    }

    // Fallback: attempt to read as text and parse similarly to CSV
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return;
        let start = 0;
        const first = lines[0].split(',').map((c) => c.toLowerCase());
        if (first.includes('name') && first.includes('date')) start = 1;
        const parsed = [];
        for (let i = start; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 2) {
            const n = cols[0].trim();
            const d = cols[1].trim();
            if (n && d) parsed.push({ name: n, date: d });
          }
        }
        if (parsed.length) setHolidays((prev) => [...prev, ...parsed]);
      } catch (err) {
        setMessage('Failed to parse file. Ensure it is CSV, JSON or Excel.');
      }
    };
    reader.readAsText(file);
  };

  // Helper: normalize various date inputs to YYYY-MM-DD where possible
  const formatDate = (d) => {
    if (!d && d !== 0) return '';
    // Date object
    if (d instanceof Date) return d.toISOString().split('T')[0];
    // Numbers from Excel (serial dates)
    if (typeof d === 'number') {
      // Excel epoch: 1899-12-31 with shift
      const jsDate = new Date(Math.round((d - 25569) * 86400 * 1000));
      return jsDate.toISOString().split('T')[0];
    }
    // Strings
    const s = String(d).trim();
    // If already ISO-like
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) return iso.toISOString().split('T')[0];
    return s;
  };

  const handleRemove = (idx) => {
    setHolidays((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (holidays.length === 0) {
      setMessage("No holidays to upload.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidays }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Holidays uploaded successfully.");
        setHolidays([]);
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (err) {
      setMessage("Upload failed — server unreachable.");
      console.error(err);
    }
  };

  return (
    <div className="card" style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Manage Holidays</h2>

      <div className="form-section" style={{ marginBottom: 16 }}>
        <h3>Add Single Holiday</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Name / Description</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Independence Day" />
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          <button className="submit-btn" onClick={handleAddHoliday}>Add Holiday</button>
        </div>
      </div>

      <div className="form-section" style={{  marginTop: 50,marginBottom: 16 }}>
        <h3>Upload CSV / JSON</h3>
        <p style={{ marginTop: 4, marginBottom: 8, color: "#666" }}>
          CSV format: name,date (header optional). JSON: array of <code>{'{"name":"...","date":"YYYY-MM-DD"}'}</code>.
        </p>
        <input type="file" accept=".csv,.json,.xlsx,.xls" onChange={handleFileChange} />
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Preview</h3>
        {holidays.length === 0 ? (
          <p>No holidays added yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Date</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h, i) => (
                <tr key={`${h.date}-${i}`}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{h.date}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{h.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <button className="submit-btn" onClick={() => handleRemove(i)} style={{ backgroundColor: "#f44336" }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
        <button className="submit-btn" onClick={handleUpload}>Upload Holidays</button>
        <button className="submit-btn" onClick={() => { setHolidays([]); setMessage(""); }} style={{ backgroundColor: "#6c757d" }}>Clear</button>
      </div>

      {message && <p style={{ marginTop: 12, color: "#333" }}>{message}</p>}
    </div>
  );
}
