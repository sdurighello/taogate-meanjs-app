'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DefinitionDashboard = mongoose.model('DefinitionDashboard');

/**
 * Globals
 */
var user, definitionDashboard;

/**
 * Unit tests
 */
describe('Definition dashboard Model Unit Tests:', function() {
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
			definitionDashboard = new DefinitionDashboard({
				name: 'Definition dashboard Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return definitionDashboard.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			definitionDashboard.name = '';

			return definitionDashboard.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		DefinitionDashboard.remove().exec();
		User.remove().exec();

		done();
	});
});