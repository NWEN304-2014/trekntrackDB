
// bcrypt for generating password hash
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes){
var User = sequelize.define('User',{
	username:		DataTypes.STRING,
	password:	DataTypes.STRING,
	email:		DataTypes.STRING
},{
	//calling by User.methodname(param)
	classMethods: {
		generateHash: generatehash,
		
	},
	//calling by instancename.methodname(param)
	instanceMethods:{
		checkPassword: validpassword
	}
});
return User;
}


// methods ======================
// generating a hash
function generatehash(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
}
function validpassword(password){
	return bcrypt.compareSync(password,this.password);
}
