const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email and password are required" });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hashed], (err, result) => {
    if (err) {
      console.error("Registration DB error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already registered" });
      }
      return res
        .status(500)
        .json({ message: "Server error", detail: err.message });
    }
    res.status(201).json({ message: "Registered successfully" });
  });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const sql = "SELECT id, username, email, password FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Login DB error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .cookie("token", token, { httpOnly: true })
      .json({
        user: { id: user.id, username: user.username, email: user.email },
      });
  });
};
exports.getProfile = (req, res) => {
  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user, // You get this from the verifyToken middleware
  });
};

