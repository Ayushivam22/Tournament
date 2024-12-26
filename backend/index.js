const express = require("express");
const app = express();
const cors = require('cors'); 

require("dotenv").config();
const dbConnect = require("./config/database");

const PORT = process.env.PORT || 4000;
// Middleware
app.use(express.json());
app.use(cors());
// Connect to the database
dbConnect();

// Routes
const routes = require("./routes/registration");
app.use('/api/v1',routes);
//active server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
