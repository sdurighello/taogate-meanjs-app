'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogStatusArea = mongoose.model('LogStatusArea');

/**
 * Globals
 */
var user, logStatusArea;

/**
 * Unit tests
 */
describe('Log status area Model Unit Tests:', function() {
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
			logStatusArea = new LogStatusArea({
				name: 'Log status area Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return logStatusArea.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			logStatusArea.name = '';

			return logStatusArea.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		LogStatusArea.remove().exec();
		User.remove().exec();

		done();
	});
});