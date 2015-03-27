var utils = require('./utils');
var expect = require('chai').expect;

var api = utils.initApiServer();


after(utils.cleanDB);

describe('REST API: User', function () {
	
	describe('Tests signup', function () {

		it("shouldn't signup without parameters", function(done){
			api.post('/rest/users/signup')
			.send({})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't signup with password empty", function(done){
			api.post('/rest/users/signup')
			.send({username:"me", password:"   "})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't signup with username empty", function(done){
			api.post('/rest/users/signup')
			.send({username:" ", password:"myPsw"})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("should signup a new User", function(done){
			api.post('/rest/users/signup')
			.send({username:"me", password:"myPsw"})
			.expect(201)
			.end(utils.log_error(function(err, res){
				expect(res).to.be.not.null;
				expect(res.body.username).to.equal("me");
				expect(res.body.score).to.equal(0);
				done();
			}));
		});

		it("shouldn't signup with username existing", function(done){
			api.post('/rest/users/signup')
			.send({username:"me", password:"other"})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});
	});

	describe('Tests signin', function () {

		it("shouldn't signin without parameters", function(done){
			api.post('/login')
			.send({})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't signin unregister user", function(done){
			api.post('/login')
			.send({ username: 'azerty', password: 'qwerty' })
			.expect(401)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't signin with bad password", function(done){
			api.post('/login')
			.send({ username: 'me', password: 'badPsw' })
			.expect(401)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("should signin with the user", function(done){
			api.post('/login')
			.send({ username: 'me', password: 'myPsw' })
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(res).to.be.not.null;
				expect(res.body.username).to.equal("me");
				expect(res.body.score).to.equal(0);
				done();
			}));
		});
	});

	describe('Tests signout', function () {

		it("should signout user connected", function(done){
			api.post('/logout')
			.send({})
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("should signout user already signouted", function(done){
			api.post('/logout')
			.send({})
			.expect(401)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});
	});
});



