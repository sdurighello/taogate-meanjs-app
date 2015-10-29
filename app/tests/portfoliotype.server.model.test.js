'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Portfoliotype = mongoose.model('Portfoliotype');

/**
 * Globals
 */
var user, portfoliotype;

/**
 * Unit tests
 */
describe('Portfoliotype Model Unit Tests:', function() {
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
			portfoliotype = new Portfoliotype({
				name: 'Portfoliotype Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return portfoliotype.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			portfoliotype.name = '';

			return portfoliotype.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Portfoliotype.remove().exec();
		User.remove().exec();

		done();
	});
});