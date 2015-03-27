
var passport = require('../utils/passport');
var security = require('../utils/security');

//Controllers
var articles = require('../app/controllers/article');
var userCtrl = require('../app/controllers/userCtrl');


//Definitions of routes
exports.api = function (app) {

	app.post('/login', passport.authenticate('local'), userCtrl.signin);
	app.post('/logout', security.isConnected, userCtrl.signout);

	app.post('/rest/users/signup', userCtrl.signup);
	app.get('/rest/users/current', security.isConnected, userCtrl.current);
	app.get('/rest/favorites', security.isConnected, userCtrl.getFavorites);
	app.post('/rest/favorites', security.isConnected, userCtrl.addFavorite);
	app.delete('/rest/favorites/:idFavorite', security.isConnected, userCtrl.removeFavorite);

	app.get('/articles', security.isConnected, articles.list);

};