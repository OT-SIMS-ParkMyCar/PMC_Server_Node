module.exports = function(sequelize, DataTypes) {

	var Favorite = sequelize.define('Favorite', {
		latitude: DataTypes.FLOAT,
		longitude: DataTypes.FLOAT,
		address: DataTypes.STRING
	});

	return Favorite;
};