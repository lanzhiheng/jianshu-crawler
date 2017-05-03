var mongoose = require('mongoose');

// 定义文章实体n
var Post = mongoose.model('Post', {
  title: String,
  state: String,
  publishedDate: Date,
  image: String,
  content: {
    brief: String,
    extended: Object,
  },
  slug: String,
  anthology: String
})

// 定义文集实体
Anthology = mongoose.model('Anthology', {
  _id: String,
  name: String,
  key: String
})


module.exports = {
  Post,
  Anthology
};
