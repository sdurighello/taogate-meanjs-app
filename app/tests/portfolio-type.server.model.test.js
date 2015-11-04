'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioType = mongoose.model('PortfolioType');

/**
 * Globals
 */
var user, portfolioType;

/**
 * Unit tests
 */
describe('Portfolio type Model Unit Tests:', function() {
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
			portfolioType = new PortfolioType({
				name: 'Portfolio type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfolioType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfolioType.name = '';

			return portfolioType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PortfolioType.remove().exec();
		User.remove().exec();

		done();
	});
});