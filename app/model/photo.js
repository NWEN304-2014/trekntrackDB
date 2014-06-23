module.exports = function(sequelize,DataTypes){
	var Photo = sequelize.define('Photo',{
		name: DataTypes.STRING,
		coords: DataTypes.TEXT, //json string with coords data
		data: DataTypes.BLOB
	});
	
	return Photo;
}