'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskProbability = mongoose.model('RiskProbability');

/**
 * Globals
 */
var user, riskProbability;

/**
 * Unit tests
 */
describe('Risk probability Model Unit Tests:', function() {
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
			riskProbability = new RiskProbability({
				name: 'Risk probability Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return riskProbability.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			riskProbability.name = '';

			return riskProbability.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		RiskProbability.remove().exec();
		User.remove().exec();

		done();
	});
});