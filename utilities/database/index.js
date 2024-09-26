const mongoose = require('mongoose');

const db_uri = process.env.DB_ENDPOINT;

function connectDB () {
    mongoose.connect(db_uri, {})
      .then(() => console.log("database connection established"))
      .catch((error) => console.error("database connection error:", error));
}

module.exports = connectDB;