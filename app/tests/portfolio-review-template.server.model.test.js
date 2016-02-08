'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioReviewTemplate = mongoose.model('PortfolioReviewTemplate');

/**
 * Globals
 */
var user, portfolioReviewTemplate;

/**
 * Unit tests
 */
describe('Portfolio review template Model Unit Tests:', function() {
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
			portfolioReviewTemplate = new PortfolioReviewTemplate({
				name: 'Portfolio review template Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfolioReviewTemplate.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfolioReviewTemplate.name = '';

			return portfolioReviewTemplate.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PortfolioReviewTemplate.remove().exec();
		User.remove().exec();

		done();
	});
});