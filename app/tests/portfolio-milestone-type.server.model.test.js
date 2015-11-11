'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioMilestoneType = mongoose.model('PortfolioMilestoneType');

/**
 * Globals
 */
var user, portfolioMilestoneType;

/**
 * Unit tests
 */
describe('Portfolio milestone type Model Unit Tests:', function() {
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
			portfolioMilestoneType = new PortfolioMilestoneType({
				name: 'Portfolio milestone type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfolioMilestoneType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfolioMilestoneType.name = '';

			return portfolioMilestoneType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PortfolioMilestoneType.remove().exec();
		User.remove().exec();

		done();
	});
});