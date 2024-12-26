const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async() => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Db connected successfully"))
    .catch((error) => {
      console.log("Db connection failed");
      console.log(error.message);
      process.exit(1);
    });
};

//export
module.exports = dbConnect;
