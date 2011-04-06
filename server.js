var express = require('express');

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
  this.del(path + '/:id', obj.destroy);
};

// Fake records

var users = [
    { name: 'tj' }
  , { name: 'ciaran' }
  , { name: 'aaron' }
  , { name: 'guillermo' }
  , { name: 'simon' }
  , { name: 'tobi' }
];

var newsItems = [
    { id: 1, title: 'Test News 1', body: 'More testing testing 123', posted: '4/6/2011 4:35 PM' }
  , { id: 2, title: 'Testleage 2', body: 'Yet more testing of a mundane nature', posted: '4/6/2011 4:37 PM' }
  , { id: 3, title: 'Testorama 3', body: 'YATNI... yes, yet another test news item', posted: '4/6/2011 4:45 PM' }
];

// Fake controllers

var User = {
  index: function(req, res){
    res.send(users);
  },
  show: function(req, res){
    res.send(users[req.params.id] || { error: 'Cannot find user' });
  },
  destroy: function(req, res){
    var id = req.params.id;
    var destroyed = id in users;
    delete users[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find user');
  },
  range: function(req, res, a, b, format){
    var range = users.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(user){
          return '<li>' + user.name + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

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


// curl http://localhost:3000/users     -- responds with all users
// curl http://localhost:3000/users/1   -- responds with user 1
// curl http://localhost:3000/users/4   -- responds with error
// curl http://localhost:3000/users/1..3 -- responds with several users
// curl -X DELETE http://localhost:3000/users/1  -- deletes the user

app.resource('/users', User);
app.resource('/news', News);

app.get('/', function(req, res){
  res.send([
      '<h1>Examples:</h1> <ul>'
    , '<li>GET /users</li>'
    , '<li>GET /users/1</li>'
    , '<li>GET /users/3</li>'
    , '<li>GET /users/1..3</li>'
    , '<li>GET /users/1..3.json</li>'
    , '<li>DELETE /users/4</li>'
    , '</ul>'
  ].join('\n')); 
});

app.listen(80);
console.log('Express app started on port 80');
