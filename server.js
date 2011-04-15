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

app.enable('jsonp callback');

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

// Data
var highlights = [];

db.open("news.db", function (error) {
  var sql = 'SELECT * FROM highlights ORDER BY sortOrder';
  db.execute(sql, function (error, rows) {
    highlights = rows;
    console.log(rows.length + ' highlights loaded from db.');
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
    res.send(posts);
  },
  show: function(req, res){
    res.send(posts[req.params.id] || { error: 'Cannot find post' });
  },
  destroy: function(req, res){
    var id = req.params.id;
    var destroyed = id in posts;
    delete posts[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find post');
  },
  range: function(req, res, a, b, format){
    var range = posts.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(posts){
          return '<li>' + posts.title + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

var HLs = {
  index: function(req, res){
    res.send(highlights);
  },
  show: function(req, res){
    res.send(highlights[req.params.id] || { error: 'Cannot find highlight' });
  },
  destroy: function(req, res){
    var id = req.params.id;
    var destroyed = id in highlights;
    delete highlights[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find highlight');
  },
  range: function(req, res, a, b, format){
    var range = highlights.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(highlights){
          return '<li>' + posts.title + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

app.resource('/news', News);
app.resource('/posts', Posts);
app.resource('/hls', HLs);

app.get('/', function(req, res){
  res.send([
      '<h1>Services:</h1> <ul>'
    , '<li>GET <a href="news">/news</a></li>'
    , '<li>GET <a href="posts">/posts</a></li>'
    , '<li>GET <a href="hls">/hls</a></li>'
    , '</ul>'
  ].join('\n')); 
});

app.listen(80);
console.log('Express app started on port 80');
