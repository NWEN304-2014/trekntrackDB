var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client;
var bcrypt   = require('bcrypt-nodejs');

client = new pg.Client(connectionString);
client.connect();



//rc.then(function (tname,rc){
	
//});
checkTable('users');
function checkTable(tablename){
	//var deferred = new $.Deferred();
	var q = client.query("select tablename from pg_catalog.pg_tables where tablename = $1",[tablename]);
	q.on('error',function (err){
		console.log(err);
	});
	q.on('row',function(row,result){
		console.log(JSON.stringify(row));
	});
	q.on('end', function(result){
		client.end();
		console.log(JSON.stringify(result));
		if(result.rowCount==0){
	console.log('no such table exists');
	var pw = bcrypt.hashSync('admin', bcrypt.genSaltSync(8),null);
	console.log(pw);
	console.log(JSON.stringify(result.fields));
		if(result.fields.name == 'users'){
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
			});
			query.on('end',function(result){
				console.log('after create table '+JSON.stringify(result));
				client.end();
			});
		}
		
	}
	//	deferred.resolve();
	client.end();
	});
	//return deferred.promise();
}