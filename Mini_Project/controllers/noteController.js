
const Note = require("../models/Note");

// Create a new note
async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    // Check whether title and content are provided
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required."
      });
    }

    // Save the note with the logged-in user's ID
    const note = await Note.create({
      title,
      content,
      owner: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully.",
      note
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create note.",
      error: error.message
    });
  }
}


// Get all notes of the logged-in user
async function getNotes(req, res) {
  try {
    const notes = await Note.find({
      owner: req.user._id
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch notes.",
      error: error.message
    });
  }
}


// Get a single note using its ID
async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    // Check whether the note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found."
      });
    }

    return res.status(200).json({
      success: true,
      note
    });

  } catch (error) {

    // Handle invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch note.",
      error: error.message
    });
  }
}


// Update an existing note
async function updateNote(req, res) {
  try {
    const updates = {};

    // Add only the fields provided in the request
    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }

    if (req.body.content !== undefined) {
      updates.content = req.body.content;
    }

    // Check whether any field is provided for updating
    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "Provide title or content to update."
      });
    }

    // Update the note only if it belongs to the logged-in user
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      note
    });

  } catch (error) {

    // Handle invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update note.",
      error: error.message
    });
  }
}


// Delete a note
async function deleteNote(req, res) {
  try {
    // Find and delete the note belonging to the logged-in user
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully."
    });

  } catch (error) {

    // Handle invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete note.",
      error: error.message
    });
  }
}


// Export all note controller functions
module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
