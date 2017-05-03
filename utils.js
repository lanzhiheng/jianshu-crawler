var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// 拼音
var slug = require('limax');

// markdown to html
var md = require("node-markdown").Markdown;

const Entity = require('./models');

// 引入两个实体
const Post = Entity.Post;
const Anthology = Entity.Anthology;

// 保存文章数据
const savePost = (post) => {
  let postItem = {
    title: post.title,
    state: 'published',
    publishedDate: post.date,
    image: '',
    content: {
      brief: '',
      extended: {
        html: md(post.articleBody),
        md: post.articleBody
      },
    },
    slug: slug(post.title, { tone: false}),
    anthology: slug(post.anthology, {tone: false})
  }

  let postInput = new Post(postItem);
  postInput.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Awesome");
    }
  })
}

// 保存文集数据
const saveAnthology = (anthologyTitle) => {
  let anthology = {
    // 固定slug
    _id: slug(anthologyTitle, {tone: false}),
    name: anthologyTitle,
    key: slug(anthologyTitle, {tone: false})
  }

  let anthologyItem = new Anthology(anthology);
  anthologyItem.save((err) => {
    if (err) {
      // console.log(err);
    } else {
      console.log("Good");
    }
  })
}

module.exports = {
  savePost,
  saveAnthology
};
