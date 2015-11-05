'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskImpact = mongoose.model('RiskImpact');

/**
 * Globals
 */
var user, riskImpact;

/**
 * Unit tests
 */
describe('Risk impact Model Unit Tests:', function() {
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
			riskImpact = new RiskImpact({
				name: 'Risk impact Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return riskImpact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			riskImpact.name = '';

			return riskImpact.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		RiskImpact.remove().exec();
		User.remove().exec();

		done();
	});
});