'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChangeRequestPriority = mongoose.model('ChangeRequestPriority');

/**
 * Globals
 */
var user, changeRequestPriority;

/**
 * Unit tests
 */
describe('Change request priority Model Unit Tests:', function() {
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
			changeRequestPriority = new ChangeRequestPriority({
				name: 'Change request priority Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return changeRequestPriority.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			changeRequestPriority.name = '';

			return changeRequestPriority.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ChangeRequestPriority.remove().exec();
		User.remove().exec();

		done();
	});
});