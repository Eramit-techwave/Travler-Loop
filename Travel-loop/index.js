const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Connection ke liye zaroori
require('dotenv').config();

// Routes Import
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();

// Middlewares
// 1. CORS setup: Ye frontend aur backend ke beech ki deewar hatata hai
app.use(cors()); 

// 2. Body Parser: Ye frontend se aane wale JSON data ko parhne mein madad karta hai
app.use(express.json());

// Routes use karna
// Ab tumhara login URL hoga: http://localhost:5000/api/auth/login
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes); 

// MongoDB Connection
// Check karna ki tumhara MongoDB Compass peeche chalu ho
mongoose.connect('mongodb://127.0.0.1:27017/traveloopDB')
    .then(() => console.log("✅ Database connected successfully!"))
    .catch(err => console.log("DB Connection Error: ", err));

// Basic Test Route
app.get('/', (req, res) => {
    res.send("Traveloop Backend is Flying High!");
});

// Port Setting
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});