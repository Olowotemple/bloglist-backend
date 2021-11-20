const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const { SECRET } = require('../utils/config');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).end();
  }

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(request.token, SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  const user = (await User.findById(decodedToken.id)).toJSON();

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const { token } = request;
  if (!token) {
    return response.status(401).json({ error: 'missing token' });
  }

  const blog = await Blog.findById(id);
  const decodedToken = jwt.verify(token, SECRET);

  if (!decodedToken || decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'invalid token' });
  }

  if (decodedToken.id === blog.user.toString()) {
    await Blog.findByIdAndDelete(decodedToken.id);
    return response.status(204).end();
  }
});

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const res = await Blog.findByIdAndUpdate(id, request.body, { new: true });
  response.json(res);
});

module.exports = blogRouter;
