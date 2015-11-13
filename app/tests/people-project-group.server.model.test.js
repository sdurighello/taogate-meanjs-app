'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleProjectGroup = mongoose.model('PeopleProjectGroup');

/**
 * Globals
 */
var user, peopleProjectGroup;

/**
 * Unit tests
 */
describe('People project group Model Unit Tests:', function() {
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
			peopleProjectGroup = new PeopleProjectGroup({
				name: 'People project group Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return peopleProjectGroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			peopleProjectGroup.name = '';

			return peopleProjectGroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PeopleProjectGroup.remove().exec();
		User.remove().exec();

		done();
	});
});