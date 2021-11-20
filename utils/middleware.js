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
  const token = req.token;

  const decodedToken = jwt.verify(token, SECRET);

  req.user = decodedToken || null;
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
