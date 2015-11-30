'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	BaselineCost = mongoose.model('BaselineCost');

/**
 * Globals
 */
var user, baselineCost;

/**
 * Unit tests
 */
describe('Baseline cost Model Unit Tests:', function() {
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
			baselineCost = new BaselineCost({
				name: 'Baseline cost Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return baselineCost.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			baselineCost.name = '';

			return baselineCost.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		BaselineCost.remove().exec();
		User.remove().exec();

		done();
	});
});