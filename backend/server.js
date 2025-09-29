const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual Atlas connection string and database name
const uri = "mongodb+srv://isadhana2024_db_user:FnIX8dvM05J3ul2P@cluster0.bojujyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("attendance"); // Use your DB name
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

// Admin login route
app.post('/adminlogin', async (req, res) => {
  // console.log("login hit")
  const { username, password } = req.body;
  try {
    const admin = await db.collection("login").findOne({ username, password });
    if (admin) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});