'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialBenefit = mongoose.model('FinancialBenefit');

/**
 * Globals
 */
var user, financialBenefit;

/**
 * Unit tests
 */
describe('Financial benefit Model Unit Tests:', function() {
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
			financialBenefit = new FinancialBenefit({
				name: 'Financial benefit Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return financialBenefit.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			financialBenefit.name = '';

			return financialBenefit.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FinancialBenefit.remove().exec();
		User.remove().exec();

		done();
	});
});