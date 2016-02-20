'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ImprovementReason = mongoose.model('ImprovementReason');

/**
 * Globals
 */
var user, improvementReason;

/**
 * Unit tests
 */
describe('Improvement reason Model Unit Tests:', function() {
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
			improvementReason = new ImprovementReason({
				name: 'Improvement reason Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return improvementReason.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			improvementReason.name = '';

			return improvementReason.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ImprovementReason.remove().exec();
		User.remove().exec();

		done();
	});
});