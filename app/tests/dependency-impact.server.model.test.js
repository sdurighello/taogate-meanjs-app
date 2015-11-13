'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DependencyImpact = mongoose.model('DependencyImpact');

/**
 * Globals
 */
var user, dependencyImpact;

/**
 * Unit tests
 */
describe('Dependency impact Model Unit Tests:', function() {
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
			dependencyImpact = new DependencyImpact({
				name: 'Dependency impact Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return dependencyImpact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			dependencyImpact.name = '';

			return dependencyImpact.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		DependencyImpact.remove().exec();
		User.remove().exec();

		done();
	});
});