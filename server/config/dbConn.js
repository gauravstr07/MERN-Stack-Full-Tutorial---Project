const mongoose = require("mongoose");

const connectDb = () => {
  mongoose.set('strictQuery', true)
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      console.log("connected to database💾");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDb;
