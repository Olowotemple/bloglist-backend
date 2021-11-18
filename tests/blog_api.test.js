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
    title: 'Metavers, the future?',
    author: 'Satoshi Nakomoto',
    url: 'http://fake-url2035.com',
    likes: 106,
  },
];

beforeEach(async () => {
  jest.setTimeout(20000);
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
});

afterAll(() => {
  mongoose.connection.close();
});
