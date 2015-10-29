'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Peoplerole = mongoose.model('Peoplerole');

/**
 * Globals
 */
var user, peoplerole;

/**
 * Unit tests
 */
describe('Peoplerole Model Unit Tests:', function() {
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
			peoplerole = new Peoplerole({
				name: 'Peoplerole Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return peoplerole.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			peoplerole.name = '';

			return peoplerole.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Peoplerole.remove().exec();
		User.remove().exec();

		done();
	});
});