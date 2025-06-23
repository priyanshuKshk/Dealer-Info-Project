const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

const dealerRoutes = require('./routes/dealerRoutes');

app.use('/api/dealers', dealerRoutes);
app.use('/api/add-dealer', dealerRoutes);
const signupLoginRoutes = require('./routes/auth');
app.use("/", signupLoginRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT);
