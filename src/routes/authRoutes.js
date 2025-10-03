import express from "express";

const router = express.Router();

const users = [
  { id: 1, username: "user1", password: "pass1" },
  { id: 2, username: "user2", password: "pass2" },
]; // This would typically be a database

router.post("/login", (req, res) => {
  // Handle login logic here
  res.status(200).json({ message: "Login successful" });
});


router.post("/register", (req, res) => {
  // Handle registration logic here
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json({ message: "Registration successful", users });
});

export default router;