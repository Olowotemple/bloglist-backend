const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

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

  if (!request.user) {
    return response.status(401).json({ error: 'invalid token' });
  }
  const user = (await User.findById(request.user.id)).toJSON();

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
  const { token, user } = request;
  if (!token) {
    return response.status(401).json({ error: 'missing token' });
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).end();
  }

  if (!user || user.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'invalid token' });
  }

  if (user.id === blog.user.toString()) {
    await Blog.findByIdAndDelete(blog.id);
    return response.status(204).end();
  }
});

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const res = await Blog.findByIdAndUpdate(id, request.body, { new: true });
  response.json(res);
});

module.exports = blogRouter;
