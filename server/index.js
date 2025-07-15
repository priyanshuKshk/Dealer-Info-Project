const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://dealer-info-project.vercel.app",
  "https://dealer-info-project.onrender.com"
  
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
mongoose.connect(process.env.MONGO_URI)

const dealerRoutes = require('./routes/dealerRoutes');

app.use('/api/dealers', dealerRoutes);
app.use('/api/add-dealer', dealerRoutes);
const signupLoginRoutes = require('./routes/auth');
app.use("/", signupLoginRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT);
