module.exports = function(sequelize,DataTypes){
	var Track = sequelize.define('Track', {
		name: DataTypes.STRING,
		path: DataTypes.TEXT //json string with coords data
	});
	
	return Track;
}