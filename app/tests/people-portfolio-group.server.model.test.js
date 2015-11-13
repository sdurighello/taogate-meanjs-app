'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeoplePortfolioGroup = mongoose.model('PeoplePortfolioGroup');

/**
 * Globals
 */
var user, peoplePortfolioGroup;

/**
 * Unit tests
 */
describe('People portfolio group Model Unit Tests:', function() {
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
			peoplePortfolioGroup = new PeoplePortfolioGroup({
				name: 'People portfolio group Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return peoplePortfolioGroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			peoplePortfolioGroup.name = '';

			return peoplePortfolioGroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PeoplePortfolioGroup.remove().exec();
		User.remove().exec();

		done();
	});
});