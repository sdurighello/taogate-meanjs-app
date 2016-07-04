'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateProcessTemplate = mongoose.model('GateProcessTemplate');

/**
 * Globals
 */
var user, gateProcessTemplate;

/**
 * Unit tests
 */
describe('Gate process template Model Unit Tests:', function() {
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
			gateProcessTemplate = new GateProcessTemplate({
				name: 'Gate process template Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return gateProcessTemplate.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			gateProcessTemplate.name = '';

			return gateProcessTemplate.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		GateProcessTemplate.remove().exec();
		User.remove().exec();

		done();
	});
});