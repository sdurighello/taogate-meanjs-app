'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialCost = mongoose.model('FinancialCost');

/**
 * Globals
 */
var user, financialCost;

/**
 * Unit tests
 */
describe('Financial cost Model Unit Tests:', function() {
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
			financialCost = new FinancialCost({
				name: 'Financial cost Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return financialCost.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			financialCost.name = '';

			return financialCost.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FinancialCost.remove().exec();
		User.remove().exec();

		done();
	});
});