'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateOutcomeReview = mongoose.model('GateOutcomeReview');

/**
 * Globals
 */
var user, gateOutcomeReview;

/**
 * Unit tests
 */
describe('Gate outcome review Model Unit Tests:', function() {
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
			gateOutcomeReview = new GateOutcomeReview({
				name: 'Gate outcome review Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return gateOutcomeReview.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			gateOutcomeReview.name = '';

			return gateOutcomeReview.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		GateOutcomeReview.remove().exec();
		User.remove().exec();

		done();
	});
});