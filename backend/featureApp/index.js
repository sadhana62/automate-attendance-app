const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const cors = require('cors');
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


// ✅ Function to create admin_login table if it doesn't exist
async function createAdminTable() {
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_login (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Insert default admin (only if it doesn't already exist)
    await conn.query(`
      INSERT IGNORE INTO admin_login (id, username, password)
      VALUES (1, 'admin', 'password123')
    `);

    console.log("✅ admin_login table ready with default admin user");
  } catch (err) {
    console.error("❌ Error creating admin_login table:", err);
  }
}


/* ============================
   ✅ Admin Login Route
   ============================ */
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await conn.query(
      "SELECT * FROM admin_login WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Admin login successful"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* ============================
   Existing Routes (untouched)
   ============================ */

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
        name.trim(), father_name.trim(), mother_name.trim(), formattedDob, gender.trim(),
        street?.trim() || null, city?.trim() || null, state?.trim() || null, 
        zip?.trim() || null, phone.trim(), email?.trim() || null,
        blood_group?.trim() || null, password || null
      ]);

      const studentId = studentResult.insertId;

      const insertSessionQuery = `
        INSERT INTO student_session (stu_id, class, section) 
        VALUES (?, ?, ?)
      `;
      await connection.query(insertSessionQuery, [
        studentId,
        studentClass.trim(),
        section.trim()
      ]);

      if (interests && Array.isArray(interests) && interests.length > 0) {
        const insertInterestQuery = `
          INSERT INTO student_interest (stu_id, interest) 
          VALUES (?, ?)
        `;
        for (const interest of interests) {
          await connection.query(insertInterestQuery, [studentId, interest.trim()]);
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  createAdminTable();
});
