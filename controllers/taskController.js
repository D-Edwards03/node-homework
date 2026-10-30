const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const taskCounter = (() => {
  let lastTaskNumber = 0;
  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();

const create = (req, res) => {
  // Ensure req.body is an object before validating
  if (!req.body) req.body = {};
  
  // Validate req.body with taskSchema
  const { error, value } = taskSchema.validate(req.body);

  // Return 400 if validation fails
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const newTask = {
    id: taskCounter(),
    userId: global.user_id.email,
    ...value,
  };

  global.tasks.push(newTask);

  // Return 200 and the task without userId
  const { userId, ...sanitizedTask } = newTask;
  res.status(201).json(sanitizedTask);
};

const index = (req, res) => {
  // Get tasks for the logged-in user
  const userTasks = global.tasks.filter(task => task.userId === global.user_id.email);
  
  // Return 404 if the user has no tasks
  if (userTasks.length === 0) {
    return res.status(404).json({ message: "No tasks found for this user." });
  }

  // Remove userId from every returned task
  const sanitizedTasks = userTasks.map(task => {
    const { userId, ...sanitizedTask } = task;
    return sanitizedTask;
  });

  // Return 200 and an array of tasks if tasks exist
  res.status(200).json(sanitizedTasks);
};

const show = (req, res) => {
  // Convert req.params.id to a number
  const taskId = parseInt(req.params?.id);

  // Return 400 if the id is not valid
  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  // Find the task with that id and the logged-in user's email
  const task = global.tasks.find(t => t.id === taskId && t.userId === global.user_id.email);
  
  // Return 404 if no matching task exists
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }
  
  const { userId, ...sanitizedTask } = task;
  res.status(200).json(sanitizedTask);
};

const update = (req, res) => {
  if (!req.body) req.body = {};

  // Validate req.body with patchTaskSchema first
  const { error, value } = patchTaskSchema.validate(req.body);

  // Return 400 if validation fails
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const taskId = parseInt(req.params?.id);
  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  // Find a task with that id and the logged-in user's email
  const task = global.tasks.find(t => t.id === taskId && t.userId === global.user_id.email);
  
  // Return 404 if no matching task exists
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  // Merge the validated patch fields into the stored task
  Object.assign(task, value);

  const { userId, ...sanitizedTask } = task;
  res.status(200).json(sanitizedTask);
};

const deleteTask = (req, res) => {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const taskIndex = global.tasks.findIndex(t => t.id === taskId && t.userId === global.user_id.email);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const { userId, ...sanitizedTask } = global.tasks[taskIndex];

  global.tasks.splice(taskIndex, 1);

  res.status(200).json(sanitizedTask);
};

module.exports = {
    create,
    index,
    show,
    update,
    deleteTask
}