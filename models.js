var mongoose = require('mongoose');

// 定义文章实体n
var Post = mongoose.model('Post', {
  title: String,
  state: String,
  publishedDate: Date,
  brief: String,
  content: String,
  slug: String,
  anthology: mongoose.Schema.Types.ObjectId
})

// 定义文集实体
Anthology = mongoose.model('Anthology', {
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  key: String
})


module.exports = {
  Post,
  Anthology
};
