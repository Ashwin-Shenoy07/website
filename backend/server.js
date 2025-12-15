const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");

const app = express();

// -------------------- CORS --------------------
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// -------------------- ROUTES --------------------
app.use('/api/players', require('./routes/players'));

// PUBLIC
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

// ADMIN
app.use("/api/admin/auth", require("./routes/adminAuthRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/news", require("./routes/adminNewsRoutes"));
app.use("/api/admin/events", require("./routes/adminEventRoutes"));

// -------------------- MONGODB CONNECTION --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err.message));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
