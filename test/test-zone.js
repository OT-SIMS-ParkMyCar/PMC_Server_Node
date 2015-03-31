var utils = require('./utils');
var expect = require('chai').expect;

var api = utils.initApiServer();

before(function(next){
	utils.createAndLogUser(api, next);
});

after(utils.cleanDB);

describe('REST API: Zone', function () {
	
	describe('Tests indicate', function () {

		it("shouldn't indicate zone without latitude", function(done){
			api.post('/rest/zones/indicate')
			.send({longitude: 5.6, density: 'LOW'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't indicate zone without longitude", function(done){
			api.post('/rest/zones/indicate')
			.send({latitude: 4.5, density: 'LOW'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't indicate zone without density", function(done){
			api.post('/rest/zones/indicate')
			.send({latitude: 4.5, longitude: 5.6})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't indicate zone with not float latitude", function(done){
			api.post('/rest/zones/indicate')
			.send({latitude:'not float', longitude: 5.6, density: 'LOW'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't indicate zone with not float longitude", function(done){
			api.post('/rest/zones/indicate')
			.send({latitude:4.5, longitude: 'not float', density: 'LOW'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("shouldn't indicate zone with bad density", function(done){
			api.post('/rest/zones/indicate')
			.send({latitude:4.5, longitude: 5.6, density: 'BAD'})
			.expect(400)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				done();
			}));
		});

		it("should indicate low zone", function(done){
			api.post('/rest/zones/indicate')
			.send({latitude:4.5, longitude: 5.6, density: 'LOW'})
			.expect(201)
			.end(utils.log_error(function(err, res){
				expect(err).to.be.null;
				expect(res.body.latitude).to.equals(4.5);
				expect(res.body.longitude).to.equals(5.6);
				expect(res.body.density).to.equals('LOW');
				done();
			}));
		});
	});
});



