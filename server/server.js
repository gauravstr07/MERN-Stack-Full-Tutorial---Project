const express = require("express");
const path = require("path");

const app = express();
const port = 5000;

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

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

app.listen(port, () => {
  console.log(`server running on port: ${port}📡`);
});
