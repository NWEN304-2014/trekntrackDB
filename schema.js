var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;
var bcrypt   = require('bcrypt-nodejs');

client = new pg.Client(connectionString);
client.connect();



//rc.then(function (tname,rc){
	
//});
checkTable('users');
function checkTable(tablename){
	//var deferred = new $.Deferred();
	var q = client.query("SELECT relname from pg_class where relname = $1",[tablename]);
	q.on('error',function (err){
		console.log(err);
	});
	q.on('end', function(result){
		client.end();
		//console.log(JSON.stringify(result));
		if(result.rowCount==0){
	console.log('no such table exists');
	var pw = bcrypt.hashSync('admin', bcrypt.genSaltSync(8),null);
	console.log(pw);
	console.log(JSON.stringify(result.fields));
		if(result.fields.name == 'users'){
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
	//	deferred.resolve();
	});
	//return deferred.promise();
}