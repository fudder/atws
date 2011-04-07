var sys    = require('sys'),
    sqlite = require('sqlite');

var db = new sqlite.Database();

db.open("news.db", function (error) {
  
  if (error) throw error;
  
  var sql = 'SELECT * FROM news';
  db.execute(sql, function (error, rows) {
  
    if (error) throw error;

    rows.map(function(row){
    
      console.log(row.title);
              
    });
  });
});