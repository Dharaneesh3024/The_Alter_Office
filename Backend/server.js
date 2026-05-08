const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db_connect/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount auth routes (signup, login)
app.use('/api', authRoutes);
app.use('/api', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});