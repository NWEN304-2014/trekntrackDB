var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;
var bcrypt   = require('bcrypt-nodejs');

client = new pg.Client(connectionString);
client.connect();


var rc = checkTable('users',null);
var pw = bcrypt.hashSync('admin', bcrypt.getSaltSync(8),null);
rc.then(function (tname,rc){
	if(rc==0){
	console.log('no such table exists');
		if(tname == 'users'){
			query = client.query("CREATE TABLE users("+
								"user_id serial PRIMARY KEY,"+
								"name text NOT NULL, "+
								"email text NOT NULL, "+
								"password text NOT NULL, "+
								"bio text "+
								");"+
								"INSERT INTO users (name, email, password)"+
								" VALUES ('admin','admin', '$1');", [pw]);
		}
		
	}
}

function checkTable(tablename, callback){
	var deferred = new $.Deferred();
	var q = client.query("SELECT relname from pg_class where relname = $1",[tablename]);
	q.on('end', function(result){
		client.end();
		//console.log(JSON.stringify(result));
		callback(tablename,result.rowCount);
		deferred.resolve();
	});
	return deferred.promise();
}