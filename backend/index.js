const express = require("express");
const cors = require('cors'); 
const razorpay = require('razorpay');
require("dotenv").config();
const dbConnect = require("./config/database");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Connect to the database
dbConnect();

// Routes
const routes = require('./routes/routes')
app.use('/api/v1', routes);

// Active server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});