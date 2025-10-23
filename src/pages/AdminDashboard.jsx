import React from "react";
import Card from "../components/ui/card";
import Button from "@mui/material/Button";
import { Users, GraduationCap, CalendarDays, BarChart2 } from "lucide-react";

const gradientBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  padding: '40px 0',
};

const glassCard = {
  borderRadius: 24,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.18)',
};

const statIconStyle = { marginBottom: 12 };

function StatCard({ icon, title, value, color }) {
  return (
    <Card style={glassCard} sx={{ minWidth: 200 }}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
        <div style={{ ...statIconStyle }}>{icon}</div>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '12px 0 4px', color }}>{title}</h2>
        <p style={{ fontSize: 28, fontWeight: 700 }}>{value}</p>
      </CardContent>
    </Card>
  );
}


function AdminDashboard() {
  return (
    <div style={gradientBg}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1976d2', marginBottom: 8, letterSpacing: 1 }}>Administrator Dashboard</h1>
        <p style={{ fontSize: 18, color: '#555', fontWeight: 500 }}>
          Manage your school’s attendance system and user accounts.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
        <StatCard icon={<Users size={40} color="#1976d2" />} title="Total Students" value={0} color="#1976d2" />
        <StatCard icon={<GraduationCap size={40} color="#388e3c" />} title="Total Teachers" value={0} color="#388e3c" />
        <StatCard icon={<CalendarDays size={40} color="#7b1fa2" />} title="Classes Today" value={0} color="#7b1fa2" />
        <StatCard icon={<BarChart2 size={40} color="#d32f2f" />} title="Attendance Rate" value="0%" color="#d32f2f" />
      </div>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card style={glassCard} sx={{ minWidth: 320, maxWidth: 400 }}>
          <CardContent style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, color: '#1976d2', letterSpacing: 1 }}>System Status</h2>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: 17, color: '#444' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>System initialized</span>
                <span style={{ color: '#388e3c', fontWeight: 600 }}>Ready for use</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Smart class integration</span>
                <span style={{ color: '#388e3c', fontWeight: 600 }}>Connected</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database status</span>
                <span style={{ color: '#388e3c', fontWeight: 600 }}>Active</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card style={glassCard} sx={{ minWidth: 320, maxWidth: 400 }}>
          <CardContent style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, color: '#1976d2', letterSpacing: 1 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Button variant="contained" color="primary" style={{ fontWeight: 600, textAlign: 'left', padding: 14, fontSize: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)' }}>👩‍🏫 Manage Teachers</Button>
              <Button variant="contained" color="primary" style={{ fontWeight: 600, textAlign: 'left', padding: 14, fontSize: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)' }}>👨‍🎓 Manage Students</Button>
              <Button variant="contained" color="secondary" style={{ fontWeight: 600, textAlign: 'left', padding: 14, fontSize: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(211, 47, 47, 0.15)' }}>✏️ Override Attendance</Button>
              <Button variant="contained" color="success" style={{ fontWeight: 600, textAlign: 'left', padding: 14, fontSize: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(56, 142, 60, 0.15)' }}>📊 View Attendance Reports</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;