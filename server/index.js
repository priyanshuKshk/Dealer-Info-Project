const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
const cors = require('cors');

const allowedOrigins = [
  "http://localhost:5173",
  "https://dealer-info-project.vercel.app",
  "https://dealer-info-project.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)

const dealerRoutes = require('./routes/dealerRoutes');

app.use('/api/dealers', dealerRoutes);
app.use('/api/add-dealer', dealerRoutes);
const signupLoginRoutes = require('./routes/auth');
app.use("/", signupLoginRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT);
