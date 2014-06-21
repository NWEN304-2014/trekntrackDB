// app/models/user.js
// load the things we need
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
function user(i,n,e,pw) {
	this.id = i;
    this.name = n;
	this.email = e;
	this.password = pw;
	this.generateHash = generatehash;
	this.validPassword = validpassword;
	this.tojsonstring = toJson;
	this.findById = findbyid;
	this.fineOne = findone;
	this.save = saveuser;
}
// methods ======================
// generating a hash
function generatehash(password){
	return bcrypt.hashSync(password, bcrypt.getSaltSync(8),null);
}
function validpassword(password){
	return bcrypt.compareSync(password,this.password);
}

function toJson(){
	var json = {
		id: this.id,
		name: this.name,
		email: this.email,
		password: this.password
	};
	return JSON.stringify(json);
}
function findone(colname,value,callback){
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE $1 = $2", [colname,value]);
	query.on("row", function(row,result){
		result.addRow(row);
	});
	query.on("end",function (result){
		client.end();
		if(result.rows.length == 1){
			callback(false, result.rows);
		}
		else{
			callback(false, null);
		}
	});
	query.on("error",function(error){
		console.log(error);
		client.end();
		callback(true,error);
	});
}

function findbyid(id,callback){
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE user_id = $1", [id]);
	query.on("row", function(row,result){
		result.addRow(row);
	});
	query.on("end",function (result){
		client.end();
		if(result.rows.length == 1){
			callback(false, result.rows);
		}
		else {
			callback(false, null);
		}
		
	});
	query.on("error",function(error){
		console.log(error);
		client.end();
		callback(true,error);
	});
}

function saveuser(user,callback){
	client.connect();
	var query = client.query("INSERT INTO users (name,email,password) "+
								"VALUES('$1','$2','$3')",[user.name,user.email,user.password]);
	
	query.on("end",function(){
		clinet.end();
	});
	query.on("error",function(error){
		console.log(error);
		client.end();
		callback(error);
	});
}
// create the model for users and expose it to our app
//module.exports = mongoose.model('User', userSchema);
module.exports.user = user;
