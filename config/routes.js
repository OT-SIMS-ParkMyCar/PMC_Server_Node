
var passport = require('../utils/passport');
var security = require('../utils/security');

//Controllers
var userCtrl = require('../app/controllers/userCtrl');
var zoneCtrl = require('../app/controllers/zoneCtrl');


//Definitions of routes
exports.api = function (app) {

	app.post('/login', passport.authenticate('local'), userCtrl.signin);
	app.post('/logout', security.isConnected, userCtrl.signout);

	app.post('/rest/users/signup', userCtrl.signup);
	app.get('/rest/users/current', security.isConnected, userCtrl.current);
	app.get('/rest/favorites', security.isConnected, userCtrl.getFavorites);
	app.post('/rest/favorites', security.isConnected, userCtrl.addFavorite);
	app.delete('/rest/favorites/:idFavorite', security.isConnected, userCtrl.removeFavorite);

	app.post('/rest/zones/indicate', security.isConnected, zoneCtrl.indicate);
	app.get('/rest/zones/', security.isConnected, zoneCtrl.getZones);

};