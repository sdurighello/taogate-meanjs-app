'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DeliveryDashboard = mongoose.model('DeliveryDashboard');

/**
 * Globals
 */
var user, deliveryDashboard;

/**
 * Unit tests
 */
describe('Delivery dashboard Model Unit Tests:', function() {
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
			deliveryDashboard = new DeliveryDashboard({
				name: 'Delivery dashboard Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return deliveryDashboard.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			deliveryDashboard.name = '';

			return deliveryDashboard.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		DeliveryDashboard.remove().exec();
		User.remove().exec();

		done();
	});
});