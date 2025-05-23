const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.header('Authorization');
  console.log('Authorization Header:', token); // Debugging log

  if (!token) return res.status(401).json({ msg: 'Accès refusé, aucun token fourni' });

  // Remove 'Bearer ' prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging log
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Debugging log
    res.status(400).json({ msg: 'Token invalide' });
  }
};

module.exports = auth;
