const jwt = require('jsonwebtoken');
const SECRET_KEY = '_jwt_secret_key'; 

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }

    req.user = user; 
    console.log('✅ Token verified. User:', user);
    next();
  });
}

module.exports = authenticateToken;
