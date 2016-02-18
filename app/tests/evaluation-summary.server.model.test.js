'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EvaluationSummary = mongoose.model('EvaluationSummary');

/**
 * Globals
 */
var user, evaluationSummary;

/**
 * Unit tests
 */
describe('Evaluation summary Model Unit Tests:', function() {
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
			evaluationSummary = new EvaluationSummary({
				name: 'Evaluation summary Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return evaluationSummary.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			evaluationSummary.name = '';

			return evaluationSummary.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		EvaluationSummary.remove().exec();
		User.remove().exec();

		done();
	});
});