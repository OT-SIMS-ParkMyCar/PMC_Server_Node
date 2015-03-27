var express = require('express'),
	config = require('./config/config'),
	db = require('./app/models');

var app = express();

require('./utils/express')(app, config);

db.sequelize
	.sync()
	.then(function() {
		app.listen(config.port);
	}).catch(function(e) {
		throw new Error(e);
	});

// expose app
exports = module.exports = app