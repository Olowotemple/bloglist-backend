const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const user = jwt.verify(req.token, SECRET);
    req.user = user || null;
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
