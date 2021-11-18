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

afterAll(() => {
  mongoose.connection.close();
});
