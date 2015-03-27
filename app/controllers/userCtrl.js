var User = require('../models').User;

var errorManager = require('../../utils/errorManager');


exports.signin = function(req, res) {
	res.status(200).send(req.user);
};

exports.signout = function(req, res) {
	req.logout();
	res.status(200).send({
		success: "a+"
	});
}

exports.signup = function(req, res) {
	//Check parameters
	var newUser = {
		username: req.body.username,
		password: req.body.password,
		score: 0
	};

	if (!newUser.username || newUser.username.trim() == "" || !newUser.password || newUser.password.trim() == "") {
		return res.status(400).send("parameters not valid");
	}


	//Check if username doesn't exist
	User.getUserByUsername(newUser.username, function(err, user) {
		if (err) return res.status(500).send(err);

		if (user) return res.status(400).send("Username already exist");

		//Create new User
		User.create(newUser).then(function(user) {
			res.status(201).send(user);
		}).catch(errorManager.errorServer(res));
	})
}

exports.current = function(req, res) {
	res.status(200).send(req.user);
};


exports.getFavorites = function(req, res) {
	req.user.getFavorites().then(function (favorites) {
		res.status(200).send(favorites);
	}).catch(errorManager.errorServer(res));
};

exports.addFavorite = function(req, res) {
	var newFav = {
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		address: req.body.address
	}

	//Check attributes
	if(!newFav.latitude || !newFav.longitude || !newFav.address){
		return res.status(400).send("parameters not valid");
	}

	req.user.createFavorite(newFav).then(function (favorite) {
		res.status(200).send(favorite);
	}).catch(errorManager.errorServer(res));
};

exports.removeFavorite = function(req, res) {

	//get the favorite
	req.user.getFavorites({where:{id: parseInt(req.params.idFavorite)}}).then(function (favorites) {
		if(!favorites || favorites.length == 0) return res.status(404).send("favorite not found");

		req.user.removeFavorite(favorites[0]).then(function () {
			favorites[0].destroy()
			.then(function(){
				res.status(200).send("Favorite removed");
			})
			.catch(errorManager.errorServer(res));

			
		}).catch(errorManager.errorServer(res));
	
	}).catch(errorManager.errorServer(res));
};