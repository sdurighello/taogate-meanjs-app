'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectAreaReview = mongoose.model('ProjectAreaReview');

/**
 * Globals
 */
var user, projectAreaReview;

/**
 * Unit tests
 */
describe('Project area review Model Unit Tests:', function() {
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
			projectAreaReview = new ProjectAreaReview({
				name: 'Project area review Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projectAreaReview.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			projectAreaReview.name = '';

			return projectAreaReview.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ProjectAreaReview.remove().exec();
		User.remove().exec();

		done();
	});
});