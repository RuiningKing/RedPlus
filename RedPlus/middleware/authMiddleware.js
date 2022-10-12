const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = (role) =>
  asyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token
        const user = await User.findById(decoded._id).select("-password");

        // Check role
        if (
          (role === "expert" && user.role !== "expert") ||
          (role === "user" && user.role !== "expert" && user.role !== "user")
        )
          throw new Error("You don't have the privileges");

        // Attach user to the next middleware
        req.user = user;
        next();
      } catch (error) {
        console.log("Auth middleware", error);
        res.status(401);
        throw new Error("Not authorized");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });

module.exports = { protect };
