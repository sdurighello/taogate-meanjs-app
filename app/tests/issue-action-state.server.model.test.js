'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssueActionState = mongoose.model('IssueActionState');

/**
 * Globals
 */
var user, issueActionState;

/**
 * Unit tests
 */
describe('Issue action state Model Unit Tests:', function() {
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
			issueActionState = new IssueActionState({
				name: 'Issue action state Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return issueActionState.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			issueActionState.name = '';

			return issueActionState.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		IssueActionState.remove().exec();
		User.remove().exec();

		done();
	});
});