'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectReviewType = mongoose.model('ProjectReviewType');

/**
 * Globals
 */
var user, projectReviewType;

/**
 * Unit tests
 */
describe('Project review type Model Unit Tests:', function() {
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
			projectReviewType = new ProjectReviewType({
				name: 'Project review type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projectReviewType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			projectReviewType.name = '';

			return projectReviewType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ProjectReviewType.remove().exec();
		User.remove().exec();

		done();
	});
});