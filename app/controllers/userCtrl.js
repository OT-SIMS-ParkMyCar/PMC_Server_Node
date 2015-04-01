
var userService = require('../services/userService');

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
	userService.getUserByUsername(newUser.username, function(err, user) {
		if (err) return res.status(500).send(err);

		if (user) return res.status(400).send("Username already exist");

		//Create new User
		userService.createUser(newUser, function(err, userCreated) {
			if(err) return errorManager.errorServer(err, res);
			else res.status(201).send(userCreated);
		});
	})
}

exports.current = function(req, res) {
	res.status(200).send(req.user);
};


exports.getFavorites = function(req, res) {
	userService.getFavorites(req.user, function (err, favorites) {
		if(err) return errorManager.errorServer(err, res);
		else res.status(200).send(favorites);
	});
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

	newFav.latitude = parseFloat(newFav.latitude);
	newFav.longitude = parseFloat(newFav.longitude);
	if(isNaN(newFav.latitude) || isNaN(newFav.longitude)){ //Check latitude and longitude
		return res.status(400).send("longitude and latitude must be float");	
	}

	newFav.address = newFav.address.trim();
	if(newFav.address === ""){
		return res.status(400).send("need an address");		
	}

	userService.addFavorite(req.user, newFav, function (err, favorite) {
		if(err) return errorManager.errorServer(err, res);
		else res.status(200).send(favorite);
	});
};

exports.removeFavorite = function(req, res) {

	userService.removeFavorite(req.user, req.params.idFavorite, function(err){
		if(err){
			if(err === userService.ServiceError.FAVORITE_NOT_FOUND){
				return res.status(404).send("favorite not found");
			}
			else{
				return errorManager.errorServer(err, res);
			}
		}
		else res.status(200).send("Favorite removed");
	});
};