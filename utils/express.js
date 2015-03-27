var express = require('express');


var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('./passport');
var errorManager = require('./errorManager');
var config = require('../config/config');

var session = require('express-session')
var MySqlStore = require('connect-mysql')(session);


module.exports = function(app, config) {

	var env = process.env.NODE_ENV || 'development';
	app.locals.ENV = env;
	app.locals.ENV_DEVELOPMENT = env == 'development';

	if(env !== 'test'){
		app.use(logger('dev'));
	}
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(methodOverride());

	
	app.use( session({
        secret: "I work with sessions",
        store: new MySqlStore({
	        config: {
	            user: config.db.username, 
	            password: config.db.password, 
	            database: config.db.database 
	        }
        })
    }));

	//Passport security
	app.use(passport.initialize());
	app.use(passport.session());

	//Add routes
	require("../config/routes").api(app);

	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			errorManager.errorServer(res)(err);
		});
	}
};