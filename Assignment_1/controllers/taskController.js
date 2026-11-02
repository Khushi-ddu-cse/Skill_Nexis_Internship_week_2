const mongoose = require("mongoose");
const Task = require("../models/Task");

// GET: Saare tasks fetch karna
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET: ID se ek task fetch karna
const getTaskById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ success: false, message: "Invalid task ID" });

        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ success: false, message: "Task not found" });

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST: Naya task add karna
const createTask = async (req, res) => {
    try {
        const { title, description, completed, priority } = req.body;
        if (typeof title !== "string" || !title.trim())
            return res.status(400).json({ success: false, message: "Task title is required" });

        const task = await Task.create({
            title: title.trim(), description, completed, priority
        });
        res.status(201).json({ success: true, message: "Task added successfully", data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT: Existing task update karna
const updateTask = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ success: false, message: "Invalid task ID" });

        const allowed = ["title", "description", "completed", "priority"];
        const updates = {};
        for (const field of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, field))
                updates[field] = req.body[field];
        }

        if (Object.keys(updates).length === 0)
            return res.status(400).json({ success: false, message: "Provide a valid field to update" });

        if (updates.title !== undefined &&
            (typeof updates.title !== "string" || !updates.title.trim()))
            return res.status(400).json({ success: false, message: "Task title cannot be empty" });

        if (typeof updates.title === "string") updates.title = updates.title.trim();

        const task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true, runValidators: true
        });
        if (!task)
            return res.status(404).json({ success: false, message: "Task not found" });

        res.status(200).json({ success: true, message: "Task updated successfully", data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE: Task delete karna
const deleteTask = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ success: false, message: "Invalid task ID" });

        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).json({ success: false, message: "Task not found" });

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
