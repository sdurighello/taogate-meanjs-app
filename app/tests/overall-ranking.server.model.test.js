'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	OverallRanking = mongoose.model('OverallRanking');

/**
 * Globals
 */
var user, overallRanking;

/**
 * Unit tests
 */
describe('Overall ranking Model Unit Tests:', function() {
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
			overallRanking = new OverallRanking({
				name: 'Overall ranking Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return overallRanking.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			overallRanking.name = '';

			return overallRanking.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		OverallRanking.remove().exec();
		User.remove().exec();

		done();
	});
});