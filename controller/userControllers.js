import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import { validateEmail, validatePassword } from "../validation/userValidation.js";
import bcrypt from "bcrypt";

import db from "../config/dbConfig.js";

// @desc Login
// route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if email or username exists in the database
  const [rows] = await db.query(
    'SELECT id, username, email, password FROM users WHERE email = ? OR username = ?',
    [email, username]
  );

  // If no user found, return error
  if (rows.length === 0) {
    return res.status(403).json({ message: "Incorrect username or password" });
  }

  const user = rows[0];

  // Check if the password is valid
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Incorrect username or password" });
  }

  res.status(200).json({
    user: { id: user.id, username: user.username, email: user.email },
  });
});



// @desc Register
// route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email format
  if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email format" });

  // Validate password format
  if (!validatePassword(password))
    return res.status(400).json({
      message: "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });


  const [user] = await db.query(
    'SELECT * FROM users WHERE username =? or email= ?',
    [username, email]
  );

  if (user.length > 0) {
    return res.status(403).send({ message: "User already exists" });
  }


  // Check if user already exists
  const hashedpassword = await bcrypt.hash(password, 10);
  // Create the new user
  const result = await db.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedpassword, email]
  )

  res.status(200).json({
    message: "User registered successfully",
    result
  });
});


// @desc Register
// route GET /api/auth/:usedid
const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // Query the database to get the user profile by ID
  const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Respond with user data (excluding sensitive data like passwords)
  res.status(200).json({ user });
});

// @desc Register
// route PUT /api/auth/:usedid
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;

  /*   // Check if a file is uploaded
    const imageurl = req.file ? `/uploads/images/${req.file.filename}` : null; */

  // Creating an array to store the fields that will be updated dynamically
  const updatedData = [];
  const queryParams = [];

  const [userU] = await db.query(
    'SELECT * FROM users WHERE username =?',
    [username]
  );

  if (userU.length > 0 && username) {
    return res.status(403).send({ message: "Username already exists" });
  }

  const [userE] = await db.query(
    'SELECT * FROM users WHERE email =?',
    [email]
  );

  if (userE.length > 0 && email) {
    return res.status(403).send({ message: "Email already exists" });
  }

  if (username) {
    updatedData.push('username = ?');
    queryParams.push(username);
  }
  if (email) {
    updatedData.push('email = ?');
    queryParams.push(email);
  }
  if (password) {
    updatedData.push('password = ?');
    queryParams.push(await bcrypt.hash(password, 10));
  }
  /*   if (imageurl) {
      updatedData.push('profile_image = ?');
      queryParams.push(imageurl);
    } */

  // If no fields to update, return a response indicating no changes were made
  if (updatedData.length === 0) {
    return res.status(400).json({ message: 'No data to update' });
  }

  queryParams.push(userId);
  const updateQuery = `UPDATE users SET ${updatedData.join(', ')} WHERE id = ?`;
  const [result] = await db.query(updateQuery, queryParams);

  if (result.affectedRows === 0) {
    return res.status(400).json({ message: 'Failed to update user profile' });
  }

  return res.status(200).json({ message: 'User updated successfully' });
});



export {
  loginUser,
  registerUser,
  getUserProfile,
  updateUser,
};