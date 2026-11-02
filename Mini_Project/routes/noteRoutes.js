
const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

// Create Express Router
const router = express.Router();

// Apply authentication middleware to all note routes
router.use(protect);

// Routes for creating and fetching notes
router.route("/")
  .post(createNote)
  .get(getNotes);

// Routes for fetching, updating and deleting a specific note
router.route("/:id")
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

// Export Note Router
module.exports = router;
