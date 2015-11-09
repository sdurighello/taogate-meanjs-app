'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SelectionFlag = mongoose.model('SelectionFlag');

/**
 * Globals
 */
var user, selectionFlag;

/**
 * Unit tests
 */
describe('Selection flag Model Unit Tests:', function() {
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
			selectionFlag = new SelectionFlag({
				name: 'Selection flag Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return selectionFlag.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			selectionFlag.name = '';

			return selectionFlag.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SelectionFlag.remove().exec();
		User.remove().exec();

		done();
	});
});