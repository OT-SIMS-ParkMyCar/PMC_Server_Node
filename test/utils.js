
var async = require('async');


module.exports = {
	initApiServer: function(){
		process.env.NODE_ENV = 'test';
		return require('supertest').agent(require('../app'));
	},

	log_error: function(done) {
		return function (err, res) {
			if (err) {
				console.error('RESPONSE (error)', res && res.text);
				console.error(err);
				console.error(Error().stack.split(/\n/)[3]);
			}
			return done(err, res);
		};
	},

	cleanDB: function(cb){
		var models = require('../app/models');
		var listModels = Object.keys(models).filter(function(modelName){
			return modelName !== "sequelize" && modelName !== "Sequelize";
		});
		async.each(listModels, function(modelName, next){
			models[modelName].destroy({where:{}}).on('success', function(res){
				next();
			}).on('error', function(err){
				next(err);
			});
		},
		function(err){
			if(err) console.log(err);
			else console.log("DB clean");
			cb();
		});
	},

	createAndLoginUser: function(api, username, password, cb){
		api.post('/rest/users/signup')
		.send({username:username, password:password})
		.end(function(err){
			if(err) return cb(err);
			module.exports.loginUser(api, username, password, cb);
		});
	},

	loginUser: function(api, username, password, cb){
		api.post('/login')
			.send({username:username, password:password})
			.end(cb);
	},

	logoutUser:function(api, cb){
		api.post('/logout')
		.end(cb);
	}
}