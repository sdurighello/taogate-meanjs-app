'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialCostGroup = mongoose.model('FinancialCostGroup');

/**
 * Globals
 */
var user, financialCostGroup;

/**
 * Unit tests
 */
describe('Financial cost group Model Unit Tests:', function() {
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
			financialCostGroup = new FinancialCostGroup({
				name: 'Financial cost group Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return financialCostGroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			financialCostGroup.name = '';

			return financialCostGroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FinancialCostGroup.remove().exec();
		User.remove().exec();

		done();
	});
});