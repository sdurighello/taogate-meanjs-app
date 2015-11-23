'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialBenefitType = mongoose.model('FinancialBenefitType');

/**
 * Globals
 */
var user, financialBenefitType;

/**
 * Unit tests
 */
describe('Financial benefit type Model Unit Tests:', function() {
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
			financialBenefitType = new FinancialBenefitType({
				name: 'Financial benefit type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return financialBenefitType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			financialBenefitType.name = '';

			return financialBenefitType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FinancialBenefitType.remove().exec();
		User.remove().exec();

		done();
	});
});