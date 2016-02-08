'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioReviewType = mongoose.model('PortfolioReviewType');

/**
 * Globals
 */
var user, portfolioReviewType;

/**
 * Unit tests
 */
describe('Portfolio review type Model Unit Tests:', function() {
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
			portfolioReviewType = new PortfolioReviewType({
				name: 'Portfolio review type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfolioReviewType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfolioReviewType.name = '';

			return portfolioReviewType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PortfolioReviewType.remove().exec();
		User.remove().exec();

		done();
	});
});