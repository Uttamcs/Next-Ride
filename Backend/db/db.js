const mongoose = require("mongoose");

function connectToDB() {
  const url = process.env.MONGO_URI;

  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
    });
}

module.exports = connectToDB;
