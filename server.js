const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
require('dotenv').config();

const app = express();

// Enable CORS for all routes
const allowedOrigins = [
  'https://euphonious-sunshine-b6409e.netlify.app',
  'https://peaceful-kataifi-11d5db.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", authRoutes); // Use the routes
// app.use('/api/appointments', appointmentRoutes);
// app.use("/healthData",healthDataRoutes);

app.use('/src/assets/doctorProfile', express.static('src/assets/doctorProfile'));
app.use('/src/assets', express.static('src/assets'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
