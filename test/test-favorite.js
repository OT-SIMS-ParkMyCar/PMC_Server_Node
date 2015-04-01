var utils = require('./utils');
var expect = require('chai').expect;

var api = utils.initApiServer();



after(utils.cleanDB);

describe('REST API: Favorite', function () {
	
	describe('Tests create for user1', function () {

		before(function(next){
			utils.createAndLoginUser(api, "testUser1", "testPassword", next);
		});

		after(function(next){
			utils.logoutUser(api, next);
		});

		it("shouldn't create favorite without latitude", function(done){
			api.post('/rest/favorites')
			.send({longitude:5.6, address:'rue du test'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't create favorite without longitude", function(done){
			api.post('/rest/favorites')
			.send({latitude:4.5, address:'rue du test'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't create favorite without address", function(done){
			api.post('/rest/favorites')
			.send({latitude:4.5, longitude:5.6})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't create favorite with bad latitude", function(done){
			api.post('/rest/favorites')
			.send({latitude:"a gauche", longitude:5.6, address:'rue du test'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't create favorite with bad longitude", function(done){
			api.post('/rest/favorites')
			.send({latitude:4.5, longitude:"en haut", address:'rue du test'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't create favorite with empty address", function(done){
			api.post('/rest/favorites')
			.send({latitude:4.5, longitude:5.6, address:' '})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("should create favorite", function(done){
			api.post('/rest/favorites')
			.send({latitude:4.5, longitude:5.6, address:'rue du test1 '})
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				expect(res.body.latitude).to.equals(4.5);
				expect(res.body.longitude).to.equals(5.6);
				expect(res.body.address).to.equals('rue du test1');
				done();
			}));
		});

		it("should create an other favorite", function(done){
			api.post('/rest/favorites')
			.send({latitude:2.1, longitude:1.2, address:'rue du test2'})
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				expect(res.body.latitude).to.equals(2.1);
				expect(res.body.longitude).to.equals(1.2);
				expect(res.body.address).to.equals('rue du test2');
				done();
			}));
		});
	});

	describe('Tests create for user2', function () {

		before(function(next){
			utils.createAndLoginUser(api, "testUser2", "testPassword", next);
		});

		after(function(next){
			utils.logoutUser(api, next);
		});

		it("should create favorite", function(done){
			api.post('/rest/favorites')
			.send({latitude:4.5, longitude:5.6, address:'rue du test3'})
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				expect(res.body.latitude).to.equals(4.5);
				expect(res.body.longitude).to.equals(5.6);
				expect(res.body.address).to.equals('rue du test3');
				done();
			}));
		});
	});

	describe('Tests get favorites of user1', function () {

		before(function(next){
			utils.loginUser(api, "testUser1", "testPassword", next);
		});

		after(function(next){
			utils.logoutUser(api, next);
		});

		it("should get favorite of the user 1", function(done){
			api.get('/rest/favorites')
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				var listFav = res.body;
				expect(listFav).to.be.not.null;
				expect(listFav.length).to.equals(2);
				expect(listFav[0].latitude).to.equals(4.5);
				expect(listFav[0].longitude).to.equals(5.6);
				expect(listFav[0].address).to.equals('rue du test1');
				expect(listFav[1].latitude).to.equals(2.1);
				expect(listFav[1].longitude).to.equals(1.2);
				expect(listFav[1].address).to.equals('rue du test2');
				done();
			}));
		});
	});

	describe('Tests get favorites of user2', function () {

		before(function(next){
			utils.loginUser(api, "testUser2", "testPassword", next);
		});

		after(function(next){
			utils.logoutUser(api, next);
		});

		it("should get favorite of the user 2", function(done){
			api.get('/rest/favorites')
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				var listFav = res.body;
				expect(listFav).to.be.not.null;
				expect(listFav.length).to.equals(1);
				expect(listFav[0].latitude).to.equals(4.5);
				expect(listFav[0].longitude).to.equals(5.6);
				expect(listFav[0].address).to.equals('rue du test3');
				done();
			}));
		});
	});

	describe('Tests delete favorites of user1', function(){
		
		var listFavorite = null;
		
		before(function(next){
			utils.loginUser(api, "testUser1", "testPassword", function(err){
				if(err) return next(err);
				api.get('/rest/favorites')
				.end(function(req, res){
					listFavorite = res.body;
					next();
				});	
			});
		});		
		
		after(function(next){
			utils.logoutUser(api, next);
		});

		it("shouldn't delete unexist favorite", function(done){
			api.delete('/rest/favorites/987654321')
			.expect(404)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("should delete first favorite", function(done){
			api.delete('/rest/favorites/' + listFavorite[0].id)
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;

				api.get('/rest/favorites')
				.end(utils.log_error(function(err, res){
					var listFav = res.body;
					expect(listFav).to.be.not.null;
					expect(listFav.length).to.equals(1);
					expect(listFav[0].latitude).to.equals(listFavorite[1].latitude);
					expect(listFav[0].longitude).to.equals(listFavorite[1].longitude);
					expect(listFav[0].address).to.equals(listFavorite[1].address);
					done();
				}));
			}));
		});

		it("should delete last favorite", function(done){
			api.delete('/rest/favorites/' + listFavorite[1].id)
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;

				api.get('/rest/favorites')
				.end(utils.log_error(function(err, res){
					var listFav = res.body;
					expect(listFav).to.be.not.null;
					expect(listFav.length).to.equals(0);
					done();
				}));
			}));
		});

	});
});




