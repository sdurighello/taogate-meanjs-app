'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateOutcomeScore = mongoose.model('GateOutcomeScore');

/**
 * Globals
 */
var user, gateOutcomeScore;

/**
 * Unit tests
 */
describe('Gate outcome score Model Unit Tests:', function() {
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
			gateOutcomeScore = new GateOutcomeScore({
				name: 'Gate outcome score Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return gateOutcomeScore.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			gateOutcomeScore.name = '';

			return gateOutcomeScore.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		GateOutcomeScore.remove().exec();
		User.remove().exec();

		done();
	});
});