'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PriorityValue = mongoose.model('PriorityValue');

/**
 * Globals
 */
var user, priorityValue;

/**
 * Unit tests
 */
describe('Priority value Model Unit Tests:', function() {
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
			priorityValue = new PriorityValue({
				name: 'Priority value Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return priorityValue.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			priorityValue.name = '';

			return priorityValue.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PriorityValue.remove().exec();
		User.remove().exec();

		done();
	});
});