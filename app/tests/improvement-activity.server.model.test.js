'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ImprovementActivity = mongoose.model('ImprovementActivity');

/**
 * Globals
 */
var user, improvementActivity;

/**
 * Unit tests
 */
describe('Improvement activity Model Unit Tests:', function() {
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
			improvementActivity = new ImprovementActivity({
				name: 'Improvement activity Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return improvementActivity.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			improvementActivity.name = '';

			return improvementActivity.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ImprovementActivity.remove().exec();
		User.remove().exec();

		done();
	});
});