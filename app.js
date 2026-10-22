const express = require("express");

const app = express();

// Replaces the manual work and JSON.parse() logic in sampleHTTP.js
// Automatically parses incoming JSON payloads for Post/Put req
app.use(express.json());

// Don't need to use if/else statements to check the URL and method
// Use .get() for GET req and specify the path
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/testpost", (req, res) => {
    // res.json() automatically sets the Content-Type header to app/json
    // and stringifies the JavaScript object
  res.status(200).json({
    message: "POST route works",
  });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

const timeRouter = require("./routes/timeRoutes");

app.use("/api", timeRouter);

module.exports = { app, server };