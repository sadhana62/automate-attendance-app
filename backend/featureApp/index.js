const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;
const QRCode = require("qrcode");
const conn = require("./db");


app.use(cors());
app.use(express.json()); // ✅ Added to handle JSON request bodies

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Nodemailer transporter setup
// IMPORTANT: Replace with your actual email service credentials.
// For better security, use environment variables instead of hardcoding.
// Example for Gmail:
// process.env.EMAIL_USER -> your.email@gmail.com
// process.env.EMAIL_PASS -> your_gmail_app_password
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER || 'sih49208@gmail.com', // Replace with your email
    pass: process.env.EMAIL_PASS || 'sih@password'    // Replace with your email password or app-specific password
  }
});

// --- DEBUGGING ---
// Check if the environment variables are loaded correctly.
console.log('Attempting to use email user:', process.env.EMAIL_USER ? 'Loaded from .env' : 'Using fallback value');

async function sendCredentialsEmail(toEmail, username, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'sih49208@gmail.com',
    to: toEmail,
    subject: 'Your Account Credentials for Smart Attendance System',
    html: `
      <p>Hello,</p>
      <p>An account has been created for you on the Smart Attendance and Management System.</p>
      <p>Here are your login credentials:</p>
      <ul>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please keep these credentials safe.</p>
      <p>Thank you!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Credentials email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Error sending credentials email to ${toEmail}:`, error);
    // We don't re-throw the error, as the registration itself was successful.
    // You might want to add more robust error handling or logging here.
  }
}


// ✅ Function to create admin_login table if it doesn't exist


async function createAdminTable() {
  try {
    // Check if the table exists
    const [tables] = await conn.query("SHOW TABLES LIKE 'admin_login'");
    
    if (tables.length === 0) {
      // Table doesn't exist, create it with the role column
      await conn.query(`
        CREATE TABLE admin_login (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'teacher') NOT NULL DEFAULT 'admin'
        )
      `);
    } else {
      // Table exists, check if the role column exists
      const [columns] = await conn.query("SHOW COLUMNS FROM admin_login LIKE 'role'");
      
      if (columns.length === 0) {
        // role column doesn't exist, add it
        await conn.query(`
          ALTER TABLE admin_login
          ADD COLUMN role ENUM('admin', 'teacher') NOT NULL DEFAULT 'admin'
        `);
      }
    }

    // Insert default admin (only if it doesn't already exist)
    await conn.query(`
      INSERT IGNORE INTO admin_login (id, username, password, role)
      VALUES (1, 'admin', 'password123', 'admin')
    `);

    console.log("✅ admin_login table ready with default admin user");
  } catch (err) {
    console.error("❌ Error creating/updating admin_login table:", err);
  }
}



async function createTeachersTable() {
  try {
       
    await conn.query(`
      CREATE TABLE IF NOT EXISTS School_teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        father_name VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        qualification VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT,
        subject JSON,
        classes JSON,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ New 'School_teachers' table created successfully.");
  } catch (err) {
    console.error("❌ Error creating teachers table:", err);
  } 
}




app.post("/admin/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [rows] = await conn.query(
      "SELECT * FROM admin_login WHERE username = ? AND password = ? AND role = ?",
      [username, password, role]
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
        role: rows[0].role
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username, password, or role"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});



app.get("/qr", async (req, res) => {
 try {
    const [results] = await conn.query("SELECT * FROM student");
    
    const students = await Promise.all(
      results.map(async (student) => {
        const qr = await QRCode.toDataURL(JSON.stringify({
          type: "student",
          id: student.id,
          name: student.name,
        }));

        return { ...student, qr };
      })
    );

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

app.post('/register', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const studentId = req.body.sid;
  const filePath = req.file.path;

  console.log(`Registering student ${studentId} with image: ${filePath}`);

  try {
    const stats = fs.statSync(filePath);
    console.log(`File size: ${stats.size} bytes`);

    const formData = new FormData();
    formData.append('sid', studentId);
    formData.append('image_path', filePath);
    formData.append('enforce_detection', 'false');

    const response = await axios.post('http://localhost:5000/enroll', formData, {
      headers: formData.getHeaders()
    });

    console.log('Python API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Python API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration',
      error: error.message
    });
  }
});

app.post('/register-student', express.json(), async (req, res) => {
  console.log("register is called")
  let connection;
  try {
    const { 
      name, father_name, mother_name, dob, gender, 
      street, city, state, zip, phone, email, blood_group, password,
      class: studentClass, section, interests
    } = req.body;

    connection = await conn.getConnection(); 
    await connection.beginTransaction();

    try {
      const insertStudentQuery = `
        INSERT INTO student (name, father_name, mother_name, dob, gender, 
                             street, city, state, zip, phone, email, blood_group, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const formattedDob = dob ? dob.split('T')[0] : null;
      const [studentResult] = await connection.query(insertStudentQuery, [
        name?.trim(), father_name?.trim(), mother_name?.trim(), formattedDob, gender?.trim(),
        street?.trim() || null, city?.trim() || null, state?.trim() || null, 
        zip?.trim() || null, phone?.trim(), email?.trim() || null,
        blood_group?.trim() || null, password || null
      ]);

      const studentId = studentResult.insertId;

      const insertSessionQuery = `
        INSERT INTO student_session (stu_id, class, section) 
        VALUES (?, ?, ?)
      `;
      await connection.query(insertSessionQuery, [
        studentId,
        studentClass?.trim(),
        section?.trim()
      ]);

      if (interests && Array.isArray(interests) && interests.length > 0) {
        const insertInterestQuery = `
          INSERT INTO student_interest (stu_id, interest) 
          VALUES (?, ?)
        `;
        for (const interest of interests) {
          await connection.query(insertInterestQuery, [studentId, interest?.trim()]);
        }
      }

      await connection.commit();

      console.log(`Student registered successfully: ${studentId}`);

      res.json({
        success: true,
        message: 'Student registered successfully',
        student_id: studentId,
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    if (connection) connection.release();
    console.error('Error registering student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while registering student',
      error: error.message
    });
  }
});


app.post('/register-teacher', express.json(), async (req, res) => {
  let connection;
  console.log("register-teacher is called",req.body);
  try {
    const {
      name, father_name, dob, gender, qualification, phone, email, address,
      subject, classes
    } = req.body;

    connection = await conn.getConnection();
    await connection.beginTransaction();

    // Generate username and password
    const username = generateUsername(name);
    const password = generatePassword();

    const insertTeacherQuery = `
      INSERT INTO School_teachers (name, father_name, dob, gender, qualification, phone, email, address,
                            subject, classes, username, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [teacherResult] = await connection.query(insertTeacherQuery, [
      name.trim(), father_name.trim(), dob, gender.trim(), qualification.trim(),
      phone.trim(), email.trim(), address.trim(),
      JSON.stringify(subject), JSON.stringify(classes),
      username, password
    ]);

    const teacherId = teacherResult.insertId;

    // Also insert credentials into the admin_login table for authentication
    const insertLoginQuery = `
      INSERT INTO admin_login (username, password, role)
      VALUES (?, ?, 'teacher')
    `;
    await connection.query(insertLoginQuery, [username, password]);


    await connection.commit();

    // Send credentials email to the teacher
    await sendCredentialsEmail(email, username, password);

    console.log(`Teacher registered successfully: ${teacherId}`);

    res.json({
      success: true,
      message: 'Teacher registered successfully',
      teacher_id: teacherId,
      username: username,
      password: password
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error registering teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while registering teacher',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});
// Helper functions for generating username and password
function generateUsername(name) {
  return name.toLowerCase().replace(/\s/g, '') + Math.floor(1000 + Math.random() * 9000);
}

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}


app.get('/api/all-teachers', async (req, res) => {
  try {
    const [teachers] = await conn.query('SELECT * FROM School_teachers');

    res.json({
      success: true,
      message: 'Teachers retrieved successfully',
      teachers: teachers
    });

  } catch (error) {
    console.error('Error retrieving teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving teachers',
      error: error.message
    });
  }
});

app.get('/api/all-students', async (req, res) => {
  try {
    const [students] = await conn.query(`
      SELECT 
        s.*, 
        ss.class, 
        ss.section,
        GROUP_CONCAT(si.interest) AS interests
      FROM 
        student s
      LEFT JOIN 
        student_session ss ON s.id = ss.stu_id
      LEFT JOIN 
        student_interest si ON s.id = si.stu_id
      GROUP BY 
        s.id
    `);

    students.forEach(student => {
      if (student.interests) {
        student.interests = student.interests.split(',').filter(Boolean);
        if (student.interests.length === 0) {
          student.interests = ['singing'];
        }
      } else {
        student.interests = ['singing'];
      }
    });

    res.json({
      success: true,
      message: 'Students retrieved successfully',
      students: students
    });

  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving students',
      error: error.message
    });
  }
});

// DELETE a student
app.delete('/api/student/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    // Manually delete from child tables first to maintain data integrity
    await connection.query('DELETE FROM student_interest WHERE stu_id = ?', [id]);
    await connection.query('DELETE FROM student_session WHERE stu_id = ?', [id]);
    const [result] = await connection.query('DELETE FROM student WHERE id = ?', [id]);

    await connection.commit();

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: 'Error deleting student', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// UPDATE a student
app.put('/api/student/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    const { 
      name, father_name, mother_name, dob, gender, 
      street, city, state, zip, phone, email, blood_group, password,
      class: studentClass, section, interests
    } = req.body;

    connection = await conn.getConnection(); 
    await connection.beginTransaction();

    const updateStudentQuery = `
      UPDATE student SET 
        name = ?, father_name = ?, mother_name = ?, dob = ?, gender = ?, 
        street = ?, city = ?, state = ?, zip = ?, phone = ?, email = ?, 
        blood_group = ?, password = ?
      WHERE id = ?
    `;
    const formattedDob = dob ? new Date(dob).toISOString().split('T')[0] : null;
    await connection.query(updateStudentQuery, [
      name.trim(), father_name.trim(), mother_name.trim(), formattedDob, gender.trim(),
      street?.trim() || null, city?.trim() || null, state?.trim() || null, 
      zip?.trim() || null, phone.trim(), email?.trim() || null,
      blood_group?.trim() || null, password || null, id
    ]);

    const updateSessionQuery = `
      UPDATE student_session SET class = ?, section = ? WHERE stu_id = ?
    `;
    await connection.query(updateSessionQuery, [studentClass.trim(), section.trim(), id]);

    // For interests, it's easiest to delete and re-insert
    await connection.query('DELETE FROM student_interest WHERE stu_id = ?', [id]);
    if (interests && Array.isArray(interests) && interests.length > 0) {
      const insertInterestQuery = `
        INSERT INTO student_interest (stu_id, interest) VALUES ?
      `;
      const interestValues = interests.map(interest => [id, interest.trim()]);
      await connection.query(insertInterestQuery, [interestValues]);
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Student updated successfully',
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(`Error updating student ${id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating student',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/verify-attendance', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const studentId = req.body.sid;
  const filePath = req.file.path;

  console.log(`Verifying attendance for student ${studentId} with image: ${filePath}`);

  try {
    const stats = fs.statSync(filePath);
    console.log(`File size: ${stats.size} bytes`);

    const formData = new FormData();
    formData.append('sid', studentId);
    formData.append('image_path', filePath);
    formData.append('enforce_detection', 'false');

    const response = await axios.post('http://localhost:5000/attendance', formData, {
      headers: formData.getHeaders()
    });

    console.log('Python API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Python API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing attendance verification',
      error: error.message
    });
  }
});

// --- Seat assignment for attended students ---
async function createSeatAssignmentsTable() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS seat_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stu_id INT NOT NULL,
        seat_number INT NOT NULL,
        date_assigned DATE NOT NULL,
        UNIQUE KEY unique_seat_per_day (seat_number, date_assigned),
        UNIQUE KEY unique_student_per_day (stu_id, date_assigned)
      )
    `);
    console.log("✅ 'seat_assignments' table is ready.");
  } catch (err) {
    console.error("❌ Error creating seat_assignments table:", err);
  }
}

// Assign a unique random seat (1..30) to a student for today
app.post('/assign-seat', express.json(), async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ success: false, message: 'studentId required' });

  let connection;
  try {
    connection = await conn.getConnection();

    // ensure table exists
    await createSeatAssignmentsTable();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // If student already has a seat today, return it
    const [existing] = await connection.query('SELECT seat_number FROM seat_assignments WHERE stu_id = ? AND date_assigned = ?', [studentId, todayStr]);
    if (existing.length > 0) {
      return res.json({ success: true, seat: existing[0].seat_number, message: 'Seat already assigned' });
    }

    // Get assigned seats for today
    const [assignedRows] = await connection.query('SELECT seat_number FROM seat_assignments WHERE date_assigned = ?', [todayStr]);
    const assigned = new Set(assignedRows.map(r => r.seat_number));

    // Build available seats 1..30
    const capacity = 30;
    const available = [];
    for (let i = 1; i <= capacity; i++) {
      if (!assigned.has(i)) available.push(i);
    }

    if (available.length === 0) {
      return res.status(400).json({ success: false, message: 'No seats available today' });
    }

    // pick random available seat
    const choice = available[Math.floor(Math.random() * available.length)];

    // insert assignment
    await connection.query('INSERT INTO seat_assignments (stu_id, seat_number, date_assigned) VALUES (?, ?, ?)', [studentId, choice, todayStr]);

    res.json({ success: true, seat: choice, message: 'Seat assigned' });

  } catch (err) {
    console.error('Error assigning seat:', err);
    res.status(500).json({ success: false, message: 'Error assigning seat', error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// GET all holidays
app.get('/api/holidays', async (req, res) => {
  try {
    const [rows] = await conn.query('SELECT id, DATE_FORMAT(date, "%Y-%m-%d") as date, name FROM holidays ORDER BY date');
    res.json({ success: true, holidays: rows });
  } catch (err) {
    console.error('Error fetching holidays:', err);
    res.status(500).json({ success: false, message: 'Error fetching holidays', error: err.message });
  }
});

// POST holidays - accepts { holidays: [{ date: 'YYYY-MM-DD', name: '...' }, ...] }
app.post('/api/holidays', express.json(), async (req, res) => {
  const { holidays } = req.body;
  if (!holidays || !Array.isArray(holidays)) {
    return res.status(400).json({ success: false, message: 'holidays array is required' });
  }

  let connection;
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const insertQuery = 'INSERT INTO holidays (`date`, `name`) VALUES ? ON DUPLICATE KEY UPDATE name = VALUES(name)';
    const values = [];

    for (const h of holidays) {
      if (!h || !h.date || !h.name) continue;
      let d = h.date;
      // Normalize date to YYYY-MM-DD if possible
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) continue;
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        d = `${yyyy}-${mm}-${dd}`;
      }
      values.push([d, h.name]);
    }

    if (values.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'No valid holiday entries provided' });
    }

    await connection.query(insertQuery, [values]);
    await connection.commit();
    res.json({ success: true, message: 'Holidays saved', count: values.length });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error saving holidays:', err);
    res.status(500).json({ success: false, message: 'Error saving holidays', error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

async function createClassManagementTables() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class_id INT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
      )
    `);
    // This subjects table is for subjects taught in a class
    await conn.query(`
      CREATE TABLE IF NOT EXISTS class_subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class_id INT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Class management tables (classes, sections, class_subjects) ready.");
  } catch (err) {
    console.error("❌ Error creating class management tables:", err);
  }
}

// GET all classes with sections and subjects
app.get('/api/classes/complete', async (req, res) => {
  try {
    const [classes] = await conn.query('SELECT * FROM classes ORDER BY name');
    const [sections] = await conn.query('SELECT * FROM sections');
    const [subjects] = await conn.query('SELECT * FROM class_subjects');

    const classMap = {};
    classes.forEach(c => {
      classMap[c.id] = { ...c, sections: [], subjects: [] };
    });

    sections.forEach(s => {
      if (classMap[s.class_id]) {
        classMap[s.class_id].sections.push({ id: s.id, name: s.name });
      }
    });

    subjects.forEach(sub => {
      if (classMap[sub.class_id]) {
        classMap[sub.class_id].subjects.push({ id: sub.id, name: sub.name });
      }
    });

    res.json({ success: true, classes: Object.values(classMap) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching class data', error: error.message });
  }
});

// POST a new class
app.post('/api/class', async (req, res) => {
  const { class: className } = req.body;
  if (!className) return res.status(400).json({ success: false, message: 'Class name is required' });
  try {
    const [result] = await conn.query('INSERT INTO classes (name) VALUES (?)', [className]);
    res.json({ success: true, class_id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding class', error: error.message });
  }
});

// DELETE a class
app.delete('/api/class/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM classes WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting class', error: error.message });
  }
});

// POST a new section
app.post('/api/section', async (req, res) => {
  const { class_id, section } = req.body;
  if (!class_id || !section) return res.status(400).json({ success: false, message: 'Class ID and section name are required' });
  try {
    const [result] = await conn.query('INSERT INTO sections (class_id, name) VALUES (?, ?)', [class_id, section]);
    res.json({ success: true, section_id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding section', error: error.message });
  }
});

// DELETE a section
app.delete('/api/section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM sections WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting section', error: error.message });
  }
});

// POST a new subject for a class
app.post('/api/subject', async (req, res) => {
  const { class_id, subject } = req.body;
  if (!class_id || !subject) return res.status(400).json({ success: false, message: 'Class ID and subject name are required' });
  try {
    const [result] = await conn.query('INSERT INTO class_subjects (class_id, name) VALUES (?, ?)', [class_id, subject]);
    res.json({ success: true, subject_id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding subject', error: error.message });
  }
});

// DELETE a subject from a class
app.delete('/api/subject/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM class_subjects WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting subject', error: error.message });
  }
});

async function createTimetablesTable() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS timetables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        section_name VARCHAR(50) NOT NULL,
        timetable_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY (class_id, section_name)
      )
    `);
    console.log("✅ 'timetables' table is ready.");
  } catch (err) {
    console.error("❌ Error creating timetables table:", err);
  }
}

async function createHolidaysTable() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS holidays (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ 'holidays' table is ready.");
  } catch (err) {
    console.error("❌ Error creating holidays table:", err);
  }
}

// Endpoint for student registration form dropdowns
app.get('/api/registration-options', async (req, res) => {
  try {
    const [classes] = await conn.query('SELECT id, name FROM classes ORDER BY name');
    const [sections] = await conn.query('SELECT id, name, class_id FROM sections ORDER BY name');
    // Assuming interests are generic and not tied to a class for student registration
    const interestOptions = [
      "Painting", "Dancing", "Analytical Maths", "Music", "Sports", "Drama", "Coding"
    ].map(i => ({ value: i, label: i }));

    res.json({
      success: true,
      classes: classes.map(c => ({ value: c.name, label: c.name, id: c.id })),
      sections: sections, // will be filtered on frontend based on class
      interests: interestOptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching registration options', error: error.message });
  }
});

// Endpoint for timetable creation options
app.get('/api/timetable-options', async (req, res) => {
  try {
    const [classes] = await conn.query('SELECT id, name FROM classes ORDER BY name');
    const [sections] = await conn.query('SELECT id, name, class_id FROM sections ORDER BY name');
    const [subjects] = await conn.query('SELECT DISTINCT name FROM class_subjects ORDER BY name');
    const [teachers] = await conn.query('SELECT DISTINCT name FROM School_teachers ORDER BY name');

    // Create a unique, sorted list of subjects and add "Leisure"
    const subjectNames = subjects.map(s => s.name);
    const allSubjects = [...new Set(["Leisure", ...subjectNames])].sort();

    res.json({
      success: true,
      classes: classes.map(c => ({ id: c.id, name: c.name })),
      sections: sections, // will be filtered on frontend
      subjects: allSubjects,
      teachers: teachers.map(t => t.name),
    });

  } catch (error) {
    console.error('Error fetching timetable options:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching timetable options', 
      error: error.message 
    });
  }
});

// POST a new timetable or update an existing one
app.post('/api/timetable', async (req, res) => {
  const { class_id, section_name, timetable_data } = req.body;

  if (!class_id || !section_name || !timetable_data) {
    return res.status(400).json({ success: false, message: 'Missing required timetable data.' });
  }

  try {
    const query = `
      INSERT INTO timetables (class_id, section_name, timetable_data)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE timetable_data = VALUES(timetable_data)
    `;
    await conn.query(query, [class_id, section_name, JSON.stringify(timetable_data)]);
    res.json({ success: true, message: 'Timetable saved successfully!' });
  } catch (error) {
    console.error('Error saving timetable:', error);
    res.status(500).json({ success: false, message: 'Error saving timetable', error: error.message });
  }
});

// GET all saved timetables
app.get('/api/timetables', async (req, res) => {
  try {
    const [timetables] = await conn.query(`
      SELECT 
        t.id, 
        t.class_id, 
        c.name as class_name, 
        t.section_name, 
        t.timetable_data 
      FROM timetables t
      JOIN classes c ON t.class_id = c.id
      ORDER BY c.name, t.section_name
    `);
    res.json({ success: true, timetables });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching timetables', error: error.message });
  }
});

// DELETE a timetable
app.delete('/api/timetable/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await conn.query('DELETE FROM timetables WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Timetable deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Timetable not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting timetable', error: error.message });
  }
});

// Endpoint to get a specific teacher's timetable
app.get('/api/teacher-timetable/:username', async (req, res) => {
  const { username } = req.params;

  // In a real application, you would query your database
  // to get the timetable for the teacher with the given username.
  // For this example, we'll return a hardcoded timetable.

  // This is a sample structure. You should build this from your database tables.
  const sampleTimetable = {
    "Monday": [
      { time: "09:00-10:00", class: "10-A", subject: "Mathematics" },
      { time: "11:00-12:00", class: "9-B", subject: "Mathematics" },
    ],
    "Tuesday": [
      { time: "10:00-11:00", class: "10-A", subject: "Mathematics" },
      { time: "13:30-14:30", class: "8-A", subject: "Physics" },
    ],
    "Wednesday": [
      { time: "09:00-10:00", class: "9-B", subject: "Mathematics" },
    ],
    "Thursday": [
      { time: "10:00-11:00", class: "10-A", subject: "Mathematics" },
      { time: "11:00-12:00", class: "8-A", subject: "Physics" },
    ],
    "Friday": [
      { time: "09:00-10:00", class: "9-B", subject: "Mathematics" },
      { time: "13:30-14:30", class: "8-A", subject: "Physics" },
    ],
    "Saturday": [],
  };

  // You can add logic here to check if the teacher exists
  // const [teacher] = await conn.query('SELECT * FROM School_teachers WHERE username = ?', [username]);
  // if (!teacher.length) {
  //   return res.status(404).json({ success: false, message: 'Teacher not found' });
  // }

  res.json({ success: true, timetable: sampleTimetable });
});

async function createNoticesTable() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ 'notices' table is ready.");
  } catch (err) {
    console.error("❌ Error creating notices table:", err);
  }
}

async function createSyllabusTable() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS syllabi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        section_name VARCHAR(50),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(512) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ 'syllabi' table is ready.");
  } catch (err) {
    console.error("❌ Error creating syllabi table:", err);
  }
}

// Upload syllabus endpoint
app.post('/api/upload-syllabus', upload.single('syllabus'), async (req, res) => {
  try {
    const { class_id, section_name } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    if (!class_id) return res.status(400).json({ success: false, message: 'class_id is required' });

    const filename = req.file.filename;
    const original_name = req.file.originalname;
    // store a web-friendly relative path in DB (so downloads work cross-platform)
    const file_path = `/uploads/${filename}`;

    const [result] = await conn.query('INSERT INTO syllabi (class_id, section_name, filename, original_name, file_path) VALUES (?, ?, ?, ?, ?)', [class_id, section_name || null, filename, original_name, file_path]);

    // return the created record info including a URL the frontend can use directly
    const syllabus = {
      id: result.insertId,
      class_id: Number(class_id),
      section_name: section_name || null,
      filename,
      original_name,
      file_path,
      url: file_path,
      uploaded_at: new Date().toISOString()
    };

    res.json({ success: true, message: 'Syllabus uploaded successfully', syllabus });
  } catch (err) {
    console.error('Error uploading syllabus:', err);
    res.status(500).json({ success: false, message: 'Error uploading syllabus', error: err.message });
  }
});

// Get syllabi list (optionally filter by class_id)
app.get('/api/syllabi', async (req, res) => {
  try {
    const { class_id } = req.query;
    let q = 'SELECT id, class_id, section_name, original_name, filename, file_path, DATE_FORMAT(uploaded_at, "%Y-%m-%d %H:%i:%s") as uploaded_at FROM syllabi';
    const params = [];
    if (class_id) {
      q += ' WHERE class_id = ?';
      params.push(class_id);
    }
    q += ' ORDER BY uploaded_at DESC';
    const [rows] = await conn.query(q, params);
    res.json({ success: true, syllabi: rows });
  } catch (err) {
    console.error('Error fetching syllabi:', err);
    res.status(500).json({ success: false, message: 'Error fetching syllabi', error: err.message });
  }
});

// Get latest syllabus for a class
app.get('/api/syllabus/:class_id', async (req, res) => {
  try {
    const { class_id } = req.params;
    if (!class_id) return res.status(400).json({ success: false, message: 'class_id required' });

    const [rows] = await conn.query(
      `SELECT id, class_id, section_name, original_name, filename, file_path, DATE_FORMAT(uploaded_at, "%Y-%m-%d %H:%i:%s") as uploaded_at
       FROM syllabi WHERE class_id = ? ORDER BY uploaded_at DESC LIMIT 1`,
      [class_id]
    );

    if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: 'No syllabus found for this class' });

    const s = rows[0];
    // Always construct a web-relative URL from the stored filename to avoid returning
    // local filesystem paths (which don't work in the browser).
    const url = `/uploads/${s.filename}`;

    res.json({ success: true, syllabus: { ...s, url } });
  } catch (err) {
    console.error('Error fetching syllabus for class:', err);
    res.status(500).json({ success: false, message: 'Error fetching syllabus', error: err.message });
  }
});

// Serve uploaded files statically under /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// GET all notices
app.get('/api/notices', async (req, res) => {
  try {
    const [notices] = await conn.query('SELECT *, DATE_FORMAT(created_at, "%d-%b-%Y %h:%i %p") as created_at_formatted FROM notices ORDER BY created_at DESC');
    res.json({ success: true, notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, message: 'Error fetching notices', error: error.message });
  }
});

// POST a new notice
app.post('/api/notice', async (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ success: false, message: 'Title and text are required' });
  }
  try {
    const [result] = await conn.query('INSERT INTO notices (title, text) VALUES (?, ?)', [title, text]);
    res.json({ success: true, notice_id: result.insertId, message: 'Notice posted successfully' });
  } catch (error) {
    console.error('Error posting notice:', error);
    res.status(500).json({ success: false, message: 'Error posting notice', error: error.message });
  }
});

// DELETE a notice
app.delete('/api/notice/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await conn.query('DELETE FROM notices WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Notice deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notice', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  createAdminTable();
  createTeachersTable();
  createNoticesTable();
  createTimetablesTable();
  createSyllabusTable();
  createClassManagementTables();
  createHolidaysTable();
});
