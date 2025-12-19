import  { useState, useEffect } from 'react';
import './Holiday.css';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/holidays');
        if (!res.ok) throw new Error('Failed to fetch holidays');
        const data = await res.json();
        if (data.success) setHolidays(data.holidays || []);
        else throw new Error(data.message || 'No holidays');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  const formatDate = (d) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return d;
    }
  };

  if (loading) return <div className="holidays-page"><div className="holidays-card"><h2>Loading holidays...</h2></div></div>;
  if (error) return <div className="holidays-page"><div className="holidays-card"><h2>Error</h2><p>{error}</p></div></div>;

  return (
    <div className="holidays-page">
      <div className="holidays-card">
        <h2 className="holidays-heading">📅 School Holidays</h2>
        {holidays.length === 0 ? (
          <p className="no-holidays">No holidays scheduled.</p>
        ) : (
          <ul className="holidays-list">
            {holidays.map((h) => (
              <li key={h.id} className="holiday-item">
                <div className="holiday-date">{formatDate(h.date)}</div>
                <div className="holiday-name">{h.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Holidays;
