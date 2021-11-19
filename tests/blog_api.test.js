const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog');
const app = require('../app');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'How to make scrambled eggs',
    author: 'Jeff Gordons',
    url: 'http://fake-url.com',
    likes: 23,
  },
  {
    title: 'Metaverse, the future?',
    author: 'Satoshi Nakomoto',
    url: 'http://fake-url2035.com',
    likes: 106,
  },
];

jest.setTimeout(20000);

beforeEach(async () => {
  await Blog.deleteMany({});
  const promiseArr = initialBlogs.map((blog) => new Blog(blog).save());
  await Promise.all(promiseArr);
});

describe('GET blogs', () => {
  const baseURL = '/api/blogs';

  test('all blogs are returned', async () => {
    const res = await api.get(baseURL);
    expect(res.body).toHaveLength(initialBlogs.length);
  });

  test('blogs are returned in JSON format', async () => {
    await api
      .get(baseURL)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('unique identifier is named id', async () => {
    const res = await api.get(baseURL);
    const blog = res.body[0];
    expect(blog.id).toBeDefined();
  });
});

describe('POST blogs', () => {
  const baseURL = '/api/blogs';

  test('a new blog post can be created', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
      url: 'http://fake-url3a7a1.com',
      likes: 292,
    };

    await api.post(baseURL).send(blog);
    const res = await api.get(baseURL);
    const blogs = res.body;
    const blogTitles = blogs.map((blog) => blog.title);
    expect(blogs).toHaveLength(initialBlogs.length + 1);
    expect(blogTitles).toContain('Your Introduction to web 3.0');
  });

  test('likes defaults to 0', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
      url: 'http://fake-url3a7a1.com',
    };

    const res = await api.post(baseURL).send(blog);
    expect(res.body.likes).toBeDefined();
    expect(res.body.likes).toEqual(0);
  });

  test('No title results in 400 Bad request', async () => {
    const blog = {
      author: 'Catalin Pit',
      url: 'http://fake-url3a7a1.com',
    };

    const res = await api.post(baseURL).send(blog);
    expect(res.status).toEqual(400);
  });

  test('No url results in 400 Bad request', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
    };

    const res = await api.post(baseURL).send(blog);
    expect(res.status).toEqual(400);
  });
});

describe('DELETE blogs', () => {
  test('a single blog post can be deleted', async () => {
    const res = await api.get('/api/blogs');
    const blogs = res.body;
    const blogToDelete = blogs[0];
    const deleteRes = await api.delete(`/api/blogs/${blogToDelete.id}`);
    expect(deleteRes.status).toEqual(204);

    const getAllRes = await api.get('/api/blogs');
    const blogsAtEnd = getAllRes.body;
    expect(blogsAtEnd).toHaveLength(blogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.titles);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('PUT blogs', () => {
  test('a single blog post can be updated', async () => {
    const res = await api.get('/api/blogs');
    const blogs = res.body;
    const blogToUpdate = blogs[0];

    const updateRes = await api.put(`/api/blogs/${blogToUpdate.id}`).send({
      title: 'Feathering Storms',
      author: 'Charone Chaperone',
      url: 'http://fakeasf-url#2.com',
      likes: 7,
    });
    expect(updateRes.status).toEqual(200);

    const getAllRes = await api.get('/api/blogs');
    const blogsAtEnd = getAllRes.body;
    const blogTitles = blogsAtEnd.map((blog) => blog.title);
    expect(blogTitles).not.toContain(blogToUpdate.title);
    expect(blogTitles).toContain(updateRes.body.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
