const Task = require("../models/Task");

const addTask = (req, res) => {
  res.render("pages/addTask");
};

const createTask = async (req, res) => {
  try {
    if (req.body.isTaskComplete === "true") {
      req.body.completed = true;
    }
    await Task.create(req.body);
    req.flash("info", "The task was created.");
    res.redirect("/tasks");
  } catch (err) {
    if (err.name === "ValidationError") {
      req.flash("error", "Validation error.");
    } else req.flash("error", "Something went wrong.");
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      req.flash("info", "deleted task");
      res.redirect("/tasks");
    } else {
      req.flash("error", `No task with id ${req.params.id} was found`);
      res.redirect("/tasks");
    }
  } catch (err) {
    req.flash("error", "Something went wrong.");
    res.redirect("/tasks");
  }
};

const editTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.render("pages/editTask", { task });
    } else {
      req.flash("error", `No task with id ${req.params.id} was found`);
      res.redirect("/tasks");
    }
  } catch (err) {
    req.flash("error", "Something went wrong.");
    res.redirect("/tasks");
  }
};

const updateTask = async (req, res) => {
  let oldTask = false;
  try {
    oldTask = await Task.findById(req.params.id);
    if (req.body.isTaskComplete === "true") {
      req.body.completed = true;
    } else {
      req.body.completed = false;
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    if (task) {
      req.flash("info", "The task was updated.");
      res.redirect("/tasks");
    } else {
      req.flash("error", `No task with id ${req.params.id} was found.`);
      res.redirect("/tasks");
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      req.flash("error", "Validation error.");
    } else {
      req.flash("error", "Something went wrong.");
    }
    if (oldTask) {
      res.render("pages/editTask", { task: oldTask });
    } else {
      res.redirect("/tasks");
    }
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("pages/tasks", { tasks });
  } catch (err) {
    req.flash("error", "Something went wrong.");
    res.render("/tasks", { tasks: [] });
  }
};

module.exports = {
  addTask,
  createTask,
  deleteTask,
  updateTask,
  editTask,
  getTasks,
};
