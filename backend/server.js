const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");

const app = express();

// -------------------- CORS --------------------
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman etc.
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    callback(new Error("CORS not allowed"));
  },
  credentials: true
}));

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
