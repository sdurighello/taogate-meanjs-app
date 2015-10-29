'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	StrategyNodeType = mongoose.model('StrategyNodeType');

/**
 * Globals
 */
var user, strategyNodeType;

/**
 * Unit tests
 */
describe('Strategy node type Model Unit Tests:', function() {
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
			strategyNodeType = new StrategyNodeType({
				name: 'Strategy node type Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return strategyNodeType.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			strategyNodeType.name = '';

			return strategyNodeType.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		StrategyNodeType.remove().exec();
		User.remove().exec();

		done();
	});
});