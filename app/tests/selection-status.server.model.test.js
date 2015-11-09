'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SelectionStatus = mongoose.model('SelectionStatus');

/**
 * Globals
 */
var user, selectionStatus;

/**
 * Unit tests
 */
describe('Selection status Model Unit Tests:', function() {
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
			selectionStatus = new SelectionStatus({
				name: 'Selection status Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return selectionStatus.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			selectionStatus.name = '';

			return selectionStatus.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SelectionStatus.remove().exec();
		User.remove().exec();

		done();
	});
});