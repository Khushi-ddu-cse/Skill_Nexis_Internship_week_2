const mongoose = require("mongoose");

// Task ka database structure define kar rahe hain
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
