var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/xblue');

// 拼音
var slug = require('limax');

// markdown to html
var md = require("node-markdown").Markdown;

const Entity = require('./models');

// 引入两个实体
const Post = Entity.Post;
const Anthology = Entity.Anthology;


let anthologyCache = {

};
// 保存文章数据
const savePost = (post) => {
  let postItem = {
    title: post.title,
    state: 'published',
    publishedDate: post.date,
    brief: '',
    content: post.articleBody,
    slug: slug(post.title, { tone: false}),
    anthology: anthologyCache[post.anthology]
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
const saveAnthology = (anthologyTitle, cb) => {
  console.log(anthologyCache);
  if (anthologyCache[anthologyTitle] === undefined) {
    let _id = mongoose.Types.ObjectId();
    anthologyCache[anthologyTitle] = _id;

    let anthology = {
      // 固定slug
      _id: _id,
      name: anthologyTitle,
      key: slug(anthologyTitle, {tone: false})
    }

    let anthologyItem = new Anthology(anthology);
    anthologyItem.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Good");
      }
    })
  }
  cb();
}

module.exports = {
  savePost,
  saveAnthology
};
