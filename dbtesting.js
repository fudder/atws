var sys    = require('sys'),
    sqlite = require('sqlite');

var db = new sqlite.Database();

db.open("news.db", function (error) {
  
  var sql = 'SELECT * FROM news';
  db.execute(sql, function (error, rows) {
  
    rows.map(function(row){

      console.log(row.title);
              
    });
  });
});
