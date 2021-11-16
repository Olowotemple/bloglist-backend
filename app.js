const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');

const app = express();

const { MONGODB_URI } = process.env;
mongoose
  .connect(MONGODB_URI)
  .then(() => void console.log('connected to MongoDB'))
  .catch(
    (error) => void console.log('error connecting to MongoDB', error.message)
  );

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
