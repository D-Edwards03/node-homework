const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const pool = require("../db/pg-pool");

const taskCounter = (() => {
  let lastTaskNumber = 0;
  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();

const create = async (req, res) => {
  // Ensure req.body is an object before validating
  if (!req.body) req.body = {};

  // Validate req.body with taskSchema
  const { error, value } = taskSchema.validate(req.body);

  // Return 400 if validation fails
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const result = await pool.query(
    `INSERT INTO tasks (title, is_completed, user_id)
     VALUES ($1, $2, $3) RETURNING id, title, is_completed AS "isCompleted"`,
    [value.title, value.isCompleted, global.user_id]
  );

  const task = result.rows[0];
  res.status(201).json(task);
};

const index = async (req, res) => {
  const result = await pool.query(
    'SELECT id, title, is_completed AS "isCompleted" FROM tasks WHERE user_id = $1',
    [global.user_id]
  );
  const tasks = result.rows;

  // Return 404 if the user has no tasks
  if (tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found for this user." });
  }

  // Return 200 and an array of tasks
  res.status(200).json(tasks);
};

const show = async (req, res) => {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const result = await pool.query(
    'SELECT id, title, is_completed AS "isCompleted" FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, global.user_id]
  );

  const task = result.rows[0];

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.status(200).json(task);
};

const update = async (req, res) => {
  if (!req.body) req.body = {};

  // Validate req.body with patchTaskSchema first
  const { error, value: taskChange } = patchTaskSchema.validate(req.body);

  // Return 400 if validation fails
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const taskId = parseInt(req.params?.id);
  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  let keys = Object.keys(taskChange);
  if (keys.length === 0) {
    return res.status(400).json({
      message: "No valid fields provided for update.",
    });
  }

  keys = keys.map((key) => (key === "isCompleted" ? "is_completed" : key));
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const idParm = `$${keys.length + 1}`;
  const userParm = `$${keys.length + 2}`;

  const result = await pool.query(
    `UPDATE tasks SET ${setClauses}
     WHERE id = ${idParm} AND user_id = ${userParm}
     RETURNING id, title, is_completed AS "isCompleted"`,
    [...Object.values(taskChange), taskId, global.user_id]
  );

  const updatedTask = result.rows[0];

  // Return 404 if no matching task exists for this user
  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.status(200).json(updatedTask);
};

const deleteTask = async (req, res) => {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, is_completed AS "isCompleted"`,
    [taskId, global.user_id]
  );

  const deletedTask = result.rows[0];

  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.status(200).json(deletedTask);
};

module.exports = {
    create,
    index,
    show,
    update,
    deleteTask
}