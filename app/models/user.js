module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		score: DataTypes.INTEGER
	}, {
		classMethods: {
			associate: function(models) {
				User.hasMany(models.Favorite, {onDelete:'CASCADE'});
			}
		}
	});

	User.getUserByUsername = function(username, cb) {
		User.find({
			where: {
				username: username
			}
		}).then(function(user) {
			cb(null, user);
		}).error(function(err) {
			return cb(err, null);
		});
	};


	return User;
};