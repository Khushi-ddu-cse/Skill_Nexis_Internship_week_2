const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const app = express();

// Middleware: JSON body parse aur cross-origin requests allow karna
app.use(cors());
app.use(express.json());

// API welcome route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to To-Do List REST API",
        endpoints: {
            getAllTasks: "GET /api/tasks",
            getSingleTask: "GET /api/tasks/:id",
            createTask: "POST /api/tasks",
            updateTask: "PUT /api/tasks/:id",
            deleteTask: "DELETE /api/tasks/:id"
        }
    });
});

app.use("/api/tasks", taskRoutes);

// Unknown route response
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
};

startServer();
