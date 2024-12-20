import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET; // Ensure this is set in your .env file

  if (!secretKey) {
    throw new Error('JWT secret key is missing!');
  }

  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
  return token;
};

export default generateToken;
