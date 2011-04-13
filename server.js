var sys     = require('sys'),
    sqlite  = require('sqlite'),
    express = require('express');

var db = new sqlite.Database();
var app = express.createServer();

// Ad-hoc example resource method

app.resource = function(path, obj) {
  this.get(path, obj.index);
  this.get(path + '/:a..:b.:format?', function(req, res){
    var a = parseInt(req.params.a, 10)
      , b = parseInt(req.params.b, 10)
      , format = req.params.format;
    obj.range(req, res, a, b, format);
  });
  this.get(path + '/:id', obj.show);
//disabling ability to delete
//this.del(path + '/:id', obj.destroy);
};

// Data
var newsItems = [];

db.open("news.db", function (error) {
  var sql = 'SELECT * FROM news';
  db.execute(sql, function (error, rows) {
    newsItems = rows;
    console.log(rows.length + ' news items loaded from db.');
  });
});

var posts = [];

db.open("news.db", function (error) {
  var sql = 'SELECT * FROM posts';
  db.execute(sql, function (error, rows) {
    posts = rows;
    console.log(rows.length + ' posts loaded from db.');
  });
});

// Controllers
var News = {
  index: function(req, res){
    res.send(newsItems);
  },
  show: function(req, res){
    res.send(newsItems[req.params.id] || { error: 'Cannot find news item' });
  },
  destroy: function(req, res){
    var id = req.params.id;
    var destroyed = id in newsItems;
    delete newsItems[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find news item');
  },
  range: function(req, res, a, b, format){
    var range = newsItems.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(newsItem){
          return '<li>' + newsItem.title + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};
var Posts = {
  index: function(req, res){
    res.send(Posts);
  },
  show: function(req, res){
    res.send(Posts[req.params.id] || { error: 'Cannot find post' });
  },
  destroy: function(req, res){
    var id = req.params.id;
    var destroyed = id in Posts;
    delete Posts[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find post');
  },
  range: function(req, res, a, b, format){
    var range = Posts.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(Posts){
          return '<li>' + Posts.title + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

app.resource('/news', News);
app.resource('/posts', Posts);

app.get('/', function(req, res){
  res.send([
      '<h1>Services:</h1> <ul>'
    , '<li>GET <a href="news">/news</a></li>'
    , '<li>GET <a href="posts">/posts</a></li>'
    , '</ul>'
  ].join('\n')); 
});

app.listen(80);
console.log('Express app started on port 80');
