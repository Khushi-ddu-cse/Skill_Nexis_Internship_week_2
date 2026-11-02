
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes using JWT authentication
async function protect(req, res, next) {
  try {
    // Get authorization header from request
    const authHeader = req.headers.authorization;

    // Check whether Bearer token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please provide a Bearer token."
      });
    }

    // Extract JWT token from authorization header
    const token = authHeader.split(" ")[1];

    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId)
      .select("_id name email");

    // Check whether the user still exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token was not found."
      });
    }

    // Store user information in request object
    req.user = user;

    // Allow the request to continue
    next();

  } catch (error) {
    // Handle invalid, expired or malformed tokens
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
}


// Export authentication middleware
module.exports = protect;
