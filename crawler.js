const Crawler = require('crawler');
var toMarkdown = require('to-markdown');
let util = require('./utils');

let articlesLink = [];
let articles = []

// 获取所有的文章链接
let crawlerMeta = new Crawler({
  maxConnections: 1,
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      let $ = res.$;
      // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
      if (res.request.headers.referer == undefined) {
        // console.log(res.request.uri.href);
        // 获取所有的标题
        $('ul.note-list').find('li').each((i, item) => {
          var $article = $(item);
          let link = $article.find('.title').attr('href');

          articlesLink.push(link);
        })
      }

    }
    done();
  }
})

var i = 1;
var queue = []

while( i < 10) {
  var uriObject = {
    uri: 'http://www.jianshu.com/u/a8522ac98584?order_by=shared_at&&page=' + i,

    // 只获取对应的数据部分
    // headers: {
    //   'X-INFINITESCROLL': true
    // }
  }

  queue.push(uriObject);
  i ++;
}

crawlerMeta.queue(queue)


let crawlerArticle = new Crawler({
  maxConnections: 1,
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      let $ = res.$;
      let article;
      // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
      let $article = $('div.article');
      let title = $article.find('.title').text();
      let date = $article.find('.publish-time').text().replace('*', '');
      let $content = $article.find('.show-content');
      let $footer = $article.find('.show-foot');
      let anthology = $footer.find('.notebook span').text();

      // 删除图片的标题
      $content.find('.image-caption').remove();
      $content.find('div').each(function(i, item) {
        var children = $(this).html();
        $(this).replaceWith(children);
      })
      let articleBody = toMarkdown($content.html());

      article = {
        title,
        date: new Date(date),
        articleBody,
        anthology
      }

      articles.push(article)
    }
    done();
  }
})



// 第一个爬虫结束之后开启第二个爬虫n
crawlerMeta.on('drain', () => {
  // console.log(articlesLink.length);
  let linkQueue = []
  articlesLink.forEach((link) => {
    linkQueue.push(`http://www.jianshu.com${link}`);
  });

  crawlerArticle.queue(linkQueue);
});


// 保存到数据库
crawlerArticle.on('drain', () => {
  articles.forEach((item) => {
    util.saveAnthology(item.anthology, () => {
      util.savePost(item);
    })
  })
})
