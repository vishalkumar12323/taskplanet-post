import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const signToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

