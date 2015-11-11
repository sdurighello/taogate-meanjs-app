'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssuePriority = mongoose.model('IssuePriority');

/**
 * Globals
 */
var user, issuePriority;

/**
 * Unit tests
 */
describe('Issue priority Model Unit Tests:', function() {
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
			issuePriority = new IssuePriority({
				name: 'Issue priority Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return issuePriority.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			issuePriority.name = '';

			return issuePriority.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		IssuePriority.remove().exec();
		User.remove().exec();

		done();
	});
});