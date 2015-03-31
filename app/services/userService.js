var User = require('../models').User;


var serviceError = {
	FAVORITE_NOT_FOUND: 'FAVORITE_NOT_FOUND'
}

exports.ServiceError = serviceError;

exports.getUserByUsername = User.getUserByUsername;

exports.createUser = function(newUser, cb){
	User.create(newUser).then(function(userCreated) {
		cb(null, userCreated);
	}).catch(cb);
}

exports.getFavorites = function(user, cb){
	user.getFavorites().then(function (favorites) {
		cb(null, favorites);
	}).catch(cb);
}

exports.addFavorite = function(user, newFavorite, cb){
	user.createFavorite(newFavorite).then(function (favorite) {
		cb(null, favorite);
	}).catch(cb);
}

exports.removeFavorite = function(user, favoriteId, cb){
	//get the favorite
	user.getFavorites({where:{id: parseInt(favoriteId)}}).then(function (favorites) {
		if(!favorites || favorites.length == 0) return cb(exports.ServiceError.FAVORITE_NOT_FOUND);

		user.removeFavorite(favorites[0]).then(function () {
			favorites[0].destroy()
			.then(function(){
				cb(null, null);
			})
			.catch(cb);
			
		}).catch(cb);
	
	}).catch(cb);
}