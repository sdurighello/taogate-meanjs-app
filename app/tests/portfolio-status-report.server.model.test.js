'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioStatusReport = mongoose.model('PortfolioStatusReport');

/**
 * Globals
 */
var user, portfolioStatusReport;

/**
 * Unit tests
 */
describe('Portfolio status report Model Unit Tests:', function() {
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
			portfolioStatusReport = new PortfolioStatusReport({
				name: 'Portfolio status report Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfolioStatusReport.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfolioStatusReport.name = '';

			return portfolioStatusReport.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PortfolioStatusReport.remove().exec();
		User.remove().exec();

		done();
	});
});