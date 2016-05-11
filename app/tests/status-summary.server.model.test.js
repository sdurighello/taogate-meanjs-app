'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	StatusSummary = mongoose.model('StatusSummary');

/**
 * Globals
 */
var user, statusSummary;

/**
 * Unit tests
 */
describe('Status summary Model Unit Tests:', function() {
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
			statusSummary = new StatusSummary({
				name: 'Status summary Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return statusSummary.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			statusSummary.name = '';

			return statusSummary.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		StatusSummary.remove().exec();
		User.remove().exec();

		done();
	});
});