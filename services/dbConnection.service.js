const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
let DB_URL = process.env.DB;

mongoose.connect(DB_URL)
  .then(() => {
    console.log("successfuly connected to mongodb", DB_URL)
  })
  .catch((err) => console.log(err.message));

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'connection error'));

conn.once('open', () => console.info('Connection to Database is successful'));

module.exports = conn
module.exports.DB_URL = DB_URL;