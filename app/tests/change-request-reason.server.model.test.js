'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChangeRequestReason = mongoose.model('ChangeRequestReason');

/**
 * Globals
 */
var user, changeRequestReason;

/**
 * Unit tests
 */
describe('Change request reason Model Unit Tests:', function() {
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
			changeRequestReason = new ChangeRequestReason({
				name: 'Change request reason Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return changeRequestReason.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			changeRequestReason.name = '';

			return changeRequestReason.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ChangeRequestReason.remove().exec();
		User.remove().exec();

		done();
	});
});