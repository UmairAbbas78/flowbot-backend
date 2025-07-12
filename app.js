const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/demo', require('./routes/demoGen.routes'));
app.use('/videos', express.static('videos'));


module.exports = app;
