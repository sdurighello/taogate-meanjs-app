'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialBenefitGroup = mongoose.model('FinancialBenefitGroup');

/**
 * Globals
 */
var user, financialBenefitGroup;

/**
 * Unit tests
 */
describe('Financial benefit group Model Unit Tests:', function() {
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
			financialBenefitGroup = new FinancialBenefitGroup({
				name: 'Financial benefit group Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return financialBenefitGroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			financialBenefitGroup.name = '';

			return financialBenefitGroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FinancialBenefitGroup.remove().exec();
		User.remove().exec();

		done();
	});
});