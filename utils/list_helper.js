const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  let max = 0;
  return blogs.reduce((acc, blog) => {
    if (blog.likes > max) {
      max = blog.likes;
      acc = { ...blog };
    }
    return acc;
  }, {});
};

module.exports = { dummy, totalLikes, favouriteBlog };
