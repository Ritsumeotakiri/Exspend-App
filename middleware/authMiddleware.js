const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key'; // Use .env in prod

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Contains userId
    next();
  });
}

module.exports = authenticateToken;
