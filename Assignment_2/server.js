require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).json({
  success: true, message: "Skill Nexis User Authentication API is running.",
  endpoints: { register: "POST /api/auth/register", login: "POST /api/auth/login", currentUser: "GET /api/auth/me" }
}));

app.use("/api/auth", authRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));

const PORT = process.env.PORT || 5001;
const startServer = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("MONGO_URI and JWT_SECRET must be configured in .env");
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
};
startServer();
