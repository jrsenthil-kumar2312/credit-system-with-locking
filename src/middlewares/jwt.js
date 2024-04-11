import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const auth_token = token.split(" ")[1]; //Remove Bearer from authorization header.

  jwt.verify(auth_token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    if (decoded.userId !== parseInt(req.params.userId)){
      return res.status(403).json({ message: 'Not authorized' });
    }

    req.userId = decoded.userId;
    next();
  });
}

export {
    verifyToken
}