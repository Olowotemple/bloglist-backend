const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const { MONGODB_URI } = require('./utils/config');
const { info, error } = require('./utils/logger');

const app = express();

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    info('connected to MongoDB');
  } catch (err) {
    void error('error connecting to MongoDB', err.message);
  }
})();

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app;
