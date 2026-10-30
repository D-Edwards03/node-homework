const express = require("express");
const app = express();

// Import routers and middlewares
const timeRouter = require("./routes/timeRoutes");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const authMiddleware = require("./middleware/auth");


// Initialize globals
global.user_id = null;
global.users = [];
global.tasks = [];

// Body parsing middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/testpost", (req, res) => {
  res.status(200).json({
    message: "POST route works",
  });
});

app.use("/api", timeRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", authMiddleware, taskRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});


module.exports = { app, server };