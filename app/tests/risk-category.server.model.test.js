'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskCategory = mongoose.model('RiskCategory');

/**
 * Globals
 */
var user, riskCategory;

/**
 * Unit tests
 */
describe('Risk category Model Unit Tests:', function() {
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
			riskCategory = new RiskCategory({
				name: 'Risk category Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return riskCategory.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			riskCategory.name = '';

			return riskCategory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		RiskCategory.remove().exec();
		User.remove().exec();

		done();
	});
});