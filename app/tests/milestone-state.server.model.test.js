'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MilestoneState = mongoose.model('MilestoneState');

/**
 * Globals
 */
var user, milestoneState;

/**
 * Unit tests
 */
describe('Milestone state Model Unit Tests:', function() {
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
			milestoneState = new MilestoneState({
				name: 'Milestone state Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return milestoneState.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			milestoneState.name = '';

			return milestoneState.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		MilestoneState.remove().exec();
		User.remove().exec();

		done();
	});
});