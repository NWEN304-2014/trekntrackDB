var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();


checkTable('users',null);

function checkTable(tablename, callback){
	var q = client.query("SELECT relname from pg_class where relname = $1",[tablename]);
	query.on('end', function(result){
		client.end();
		console.log(JSON.stringify(result));
		callback(result);
	});
}