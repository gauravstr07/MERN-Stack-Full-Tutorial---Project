require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = require("./config/corsOptions");
const connectDb = require("./config/dbConn");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");

const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

connectDb();

const app = express();
const port = 5000;

app.use(logger);
app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({
      message: "404 Page not found!",
    });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`${process.env.NODE_ENV} server running on port: ${port}📡`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
