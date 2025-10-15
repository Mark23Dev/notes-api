import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";

export const login = async (req, res) => {
  // Handle login logic here
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    // If user does not exist
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordValid = bcrypt.compareSync(password, user.password)

    const valid = bcrypt.compareSync(password, user.password)
    res.status(200).json({ message: "Login successful" });

    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign( 
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.status(200).json({ message: "Login successful", user: {
      id: user.id, name: user.name, email: user.email
    }})
  } catch (error) {
    console.log(`Error during login: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }

}

export const register = async (req, res) => {
  // Handle registration logic here
  const { name, email, password } = req.body;
  try {
   //  Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Check if there's a user with the same email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create a new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        trashFolder: { create: { name: "Trash"}}
      },
      include: { trashFolder: true }
    });
    res.status(201).json({ message: "Registration successful", user });

  } catch (error) {
    console.log(`Error during registration: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
  
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}