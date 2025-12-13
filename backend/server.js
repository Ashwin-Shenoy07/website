const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const app = express();

// -------------------- CORS --------------------
// Allowed origins (add your staging + production URLs)
const allowedOrigins = [
  "http://localhost:3000", `${process.env.FRONTEND_URL}`
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true, // <--- must for cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(cookieParser());

// -------------------- ROUTES --------------------
app.use('/api/players', require('./routes/players'));
app.use("/api/admin/auth", require("./routes/adminAuthRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// -------------------- MONGODB CONNECTION --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err.message));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
