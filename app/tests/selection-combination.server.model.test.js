'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SelectionCombination = mongoose.model('SelectionCombination');

/**
 * Globals
 */
var user, selectionCombination;

/**
 * Unit tests
 */
describe('Selection combination Model Unit Tests:', function() {
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
			selectionCombination = new SelectionCombination({
				name: 'Selection combination Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return selectionCombination.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			selectionCombination.name = '';

			return selectionCombination.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SelectionCombination.remove().exec();
		User.remove().exec();

		done();
	});
});