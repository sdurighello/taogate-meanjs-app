'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PriorityGroup = mongoose.model('PriorityGroup');

/**
 * Globals
 */
var user, priorityGroup;

/**
 * Unit tests
 */
describe('Priority group Model Unit Tests:', function() {
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
			priorityGroup = new PriorityGroup({
				name: 'Priority group Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return priorityGroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			priorityGroup.name = '';

			return priorityGroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PriorityGroup.remove().exec();
		User.remove().exec();

		done();
	});
});