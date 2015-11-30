'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	BaselineDuration = mongoose.model('BaselineDuration');

/**
 * Globals
 */
var user, baselineDuration;

/**
 * Unit tests
 */
describe('Baseline duration Model Unit Tests:', function() {
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
			baselineDuration = new BaselineDuration({
				name: 'Baseline duration Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return baselineDuration.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			baselineDuration.name = '';

			return baselineDuration.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		BaselineDuration.remove().exec();
		User.remove().exec();

		done();
	});
});