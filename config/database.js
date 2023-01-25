const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // attempt connecting db
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`MongoDB connected, DB name: ${conn.connection.host}`);
    // handle connection error
  } catch (err) {
    console.error(err);
    process.exit(1);
  };
};

module.exports = connectDB;