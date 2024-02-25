import { createError } from "../error.js";
import Task from "../models/Task.js";

export const getTasks = async (req, res, next) => {
  const { id } = req.user;
  try {
    const tasks = await Task.find({ user: id });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  const { title, description, dueDate } = req.body;
  const { id } = req.user;
  try {
    if (!title || !description) {
      return next(createError(400, "Title and description are required."));
    }
    const newTask = new Task({
      user: id,
      title,
      description,
      dueDate,
    });

    await newTask.save();
    res.status(200).json({ success: true, message: "Task created." });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.user;
  const { taskId } = req.params;
  try {
    const task = await Task.findOne({ _id: taskId, user: id });
    if (!task) {
      return next(createError(400, "Task not found."));
    }
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ success: true, message: "Task deleted." });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { id } = req.user;
  const { taskId } = req.params;
  const { title, description, completed, dueDate } = req.body;
  try {
    const task = await Task.findOne({ _id: taskId, user: id });
    if (!task) {
      return next(createError(400, "Task not found."));
    }
    await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        completed,
        dueDate,
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Task updated." });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  const { id } = req.user;
  const { taskId } = req.params;
  try {
    const task = await Task.findOne({ _id: taskId, user: id });
    if (!task) {
      return next(createError(400, "Task not found."));
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
