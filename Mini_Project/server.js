
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

// Initialize Express application
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());


// Default API route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Skill Nexis Notes API is running"
  });
});


// Authentication routes
app.use("/api/auth", authRoutes);

// Notes management routes
app.use("/api/notes", noteRoutes);


// Define server port
const PORT = process.env.PORT || 5002;


// Start the server
async function startServer() {

  // Check required environment variables
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("MONGO_URI and JWT_SECRET must be configured in .env");
    process.exit(1);
  }

  try {
    // Connect to MongoDB database
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}


// Run the application
startServer();
