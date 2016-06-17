'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioStatusUpdate = mongoose.model('PortfolioStatusUpdate');

/**
 * Globals
 */
var user, portfolioStatusUpdate;

/**
 * Unit tests
 */
describe('Portfolio status update Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			portfolioStatusUpdate = new PortfolioStatusUpdate({
				name: 'Portfolio status update Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfolioStatusUpdate.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfolioStatusUpdate.name = '';

			return portfolioStatusUpdate.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PortfolioStatusUpdate.remove().exec();
		User.remove().exec();

		done();
	});
});