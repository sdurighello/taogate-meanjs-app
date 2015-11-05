'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskSeverityAssignment = mongoose.model('RiskSeverityAssignment');

/**
 * Globals
 */
var user, riskSeverityAssignment;

/**
 * Unit tests
 */
describe('Risk severity assignment Model Unit Tests:', function() {
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
			riskSeverityAssignment = new RiskSeverityAssignment({
				name: 'Risk severity assignment Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return riskSeverityAssignment.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			riskSeverityAssignment.name = '';

			return riskSeverityAssignment.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		RiskSeverityAssignment.remove().exec();
		User.remove().exec();

		done();
	});
});