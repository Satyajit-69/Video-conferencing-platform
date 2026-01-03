import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No auth header or doesn't start with Bearer");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("No token after Bearer");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // 🔥 THIS LINE WAS MISSING
    req.user = decoded; // decoded contains _id

    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};
