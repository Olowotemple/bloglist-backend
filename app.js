const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const { MONGODB_URI } = require('./utils/config');
const { info, error } = require('./utils/logger');

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => void info('connected to MongoDB'))
  .catch((err) => void error('error connecting to MongoDB', err.message));

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
