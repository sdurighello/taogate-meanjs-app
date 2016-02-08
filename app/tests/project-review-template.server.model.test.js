'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectReviewTemplate = mongoose.model('ProjectReviewTemplate');

/**
 * Globals
 */
var user, projectReviewTemplate;

/**
 * Unit tests
 */
describe('Project review template Model Unit Tests:', function() {
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
			projectReviewTemplate = new ProjectReviewTemplate({
				name: 'Project review template Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projectReviewTemplate.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			projectReviewTemplate.name = '';

			return projectReviewTemplate.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ProjectReviewTemplate.remove().exec();
		User.remove().exec();

		done();
	});
});