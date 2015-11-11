'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectMilestoneType = mongoose.model('ProjectMilestoneType');

/**
 * Globals
 */
var user, projectMilestoneType;

/**
 * Unit tests
 */
describe('Project milestone type Model Unit Tests:', function() {
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
			projectMilestoneType = new ProjectMilestoneType({
				name: 'Project milestone type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projectMilestoneType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			projectMilestoneType.name = '';

			return projectMilestoneType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ProjectMilestoneType.remove().exec();
		User.remove().exec();

		done();
	});
});