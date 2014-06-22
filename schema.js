var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client;
var bcrypt   = require('bcrypt-nodejs');

client = new pg.Client(connectionString);
client.connect();


checkTable('users',function(rc){
	if(rc!=null && rc == 0){
		client.connect();
		var query = client.query("CREATE TABLE users("+
							"user_id serial PRIMARY KEY,"+
							"name text NOT NULL, "+
							"email text NOT NULL, "+
							"password text NOT NULL, "+
							"bio text "+
							");"+
							"INSERT INTO users (name, email, password)"+
							" VALUES ('admin','admin', '$1');", [pw]);

		query.on('error',function(err){
			console.log(err);
			client.end();
		});
		query.on('end',function(result){
			console.log('after create table '+JSON.stringify(result));
			client.end();
		});
	}
	
});

			function checkTable(tablename,callback){
				var q = client.query("select tablename from pg_catalog.pg_tables where tablename = $1",[tablename]);
				
				q.on('error',function (err){
					console.log(err);
					client.end();
					callback(null);
				});
				
				q.on('row',function(row,result){
					console.log(JSON.stringify(row));
				});
				
				q.on('end', function(result){
					client.end();
					console.log(JSON.stringify(result));
					if(result.rowCount==0){
						console.log('no such table exists');
						callback(0);
					}
					else{
						callback(result.rowCount);
					}
				});
			}
