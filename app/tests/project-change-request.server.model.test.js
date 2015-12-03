'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectChangeRequest = mongoose.model('ProjectChangeRequest');

/**
 * Globals
 */
var user, projectChangeRequest;

/**
 * Unit tests
 */
describe('Project change request Model Unit Tests:', function() {
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
			projectChangeRequest = new ProjectChangeRequest({
				name: 'Project change request Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projectChangeRequest.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			projectChangeRequest.name = '';

			return projectChangeRequest.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ProjectChangeRequest.remove().exec();
		User.remove().exec();

		done();
	});
});