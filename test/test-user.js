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
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(res).to.be.not.null;
				console.log(res.body)
				expect(res.body.username).to.equal("me");
				expect(res.body.score).to.equal(0);
				done();
			}));
		});

		it("shouldn't signup with username existing", function(done){
			api.post('/rest/users/signup')
			.send({username:"me", password:"try"})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});
	});

	describe('Tests login', function () {
		/*it("should connect the user", function(done){
			api.post('/login')
			.send({ username: 'Barack', password: 'Obama' })
			.expect(200)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});*/
	});
});



