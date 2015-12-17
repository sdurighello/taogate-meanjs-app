'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateStatusAssignment = mongoose.model('GateStatusAssignment');

/**
 * Globals
 */
var user, gateStatusAssignment;

/**
 * Unit tests
 */
describe('Gate status assignment Model Unit Tests:', function() {
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
			gateStatusAssignment = new GateStatusAssignment({
				name: 'Gate status assignment Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return gateStatusAssignment.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			gateStatusAssignment.name = '';

			return gateStatusAssignment.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		GateStatusAssignment.remove().exec();
		User.remove().exec();

		done();
	});
});