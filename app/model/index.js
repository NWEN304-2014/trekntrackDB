//get database settings
var connectionString = process.env.DATABASE_URL;
var match = connectionString.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

//connect to database
var Sequelize = require('sequelize');
var sequelize = new Sequelize(match[5], match[1], match[2],{
		dialect: 'postgres',
		protocol: 'postgres',
		port:	match[4],
		host:	match[3]
});

//load the tables by models
//the table names are <modelname>s, e.g. table name for User is Users
if(!global.hasOwnProperty('db')){
	
	global.db = {
			Sequelize: Sequelize,
			sequelize: sequelize,
			User:	sequelize.import(__dirname +'/user'),
			Photo:	sequelize.import(__dirname +'/photo'),
			Track:	sequelize.import(__dirname +'/track')
	}
	global.db.User.hasMany(global.db.Photo);
	global.db.Photo.hasOne(global.db.User);
	global.db.Track.hasOne(global.db.User);
	global.db.User.hasMany(global.db.Track);
}
module.exports = global.db;