'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DeliveryDashboard = mongoose.model('DeliveryDashboard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, deliveryDashboard;

/**
 * Delivery dashboard routes tests
 */
describe('Delivery dashboard CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Delivery dashboard
		user.save(function() {
			deliveryDashboard = {
				name: 'Delivery dashboard Name'
			};

			done();
		});
	});

	it('should be able to save Delivery dashboard instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery dashboard
				agent.post('/delivery-dashboards')
					.send(deliveryDashboard)
					.expect(200)
					.end(function(deliveryDashboardSaveErr, deliveryDashboardSaveRes) {
						// Handle Delivery dashboard save error
						if (deliveryDashboardSaveErr) done(deliveryDashboardSaveErr);

						// Get a list of Delivery dashboards
						agent.get('/delivery-dashboards')
							.end(function(deliveryDashboardsGetErr, deliveryDashboardsGetRes) {
								// Handle Delivery dashboard save error
								if (deliveryDashboardsGetErr) done(deliveryDashboardsGetErr);

								// Get Delivery dashboards list
								var deliveryDashboards = deliveryDashboardsGetRes.body;

								// Set assertions
								(deliveryDashboards[0].user._id).should.equal(userId);
								(deliveryDashboards[0].name).should.match('Delivery dashboard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Delivery dashboard instance if not logged in', function(done) {
		agent.post('/delivery-dashboards')
			.send(deliveryDashboard)
			.expect(401)
			.end(function(deliveryDashboardSaveErr, deliveryDashboardSaveRes) {
				// Call the assertion callback
				done(deliveryDashboardSaveErr);
			});
	});

	it('should not be able to save Delivery dashboard instance if no name is provided', function(done) {
		// Invalidate name field
		deliveryDashboard.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery dashboard
				agent.post('/delivery-dashboards')
					.send(deliveryDashboard)
					.expect(400)
					.end(function(deliveryDashboardSaveErr, deliveryDashboardSaveRes) {
						// Set message assertion
						(deliveryDashboardSaveRes.body.message).should.match('Please fill Delivery dashboard name');
						
						// Handle Delivery dashboard save error
						done(deliveryDashboardSaveErr);
					});
			});
	});

	it('should be able to update Delivery dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery dashboard
				agent.post('/delivery-dashboards')
					.send(deliveryDashboard)
					.expect(200)
					.end(function(deliveryDashboardSaveErr, deliveryDashboardSaveRes) {
						// Handle Delivery dashboard save error
						if (deliveryDashboardSaveErr) done(deliveryDashboardSaveErr);

						// Update Delivery dashboard name
						deliveryDashboard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Delivery dashboard
						agent.put('/delivery-dashboards/' + deliveryDashboardSaveRes.body._id)
							.send(deliveryDashboard)
							.expect(200)
							.end(function(deliveryDashboardUpdateErr, deliveryDashboardUpdateRes) {
								// Handle Delivery dashboard update error
								if (deliveryDashboardUpdateErr) done(deliveryDashboardUpdateErr);

								// Set assertions
								(deliveryDashboardUpdateRes.body._id).should.equal(deliveryDashboardSaveRes.body._id);
								(deliveryDashboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Delivery dashboards if not signed in', function(done) {
		// Create new Delivery dashboard model instance
		var deliveryDashboardObj = new DeliveryDashboard(deliveryDashboard);

		// Save the Delivery dashboard
		deliveryDashboardObj.save(function() {
			// Request Delivery dashboards
			request(app).get('/delivery-dashboards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Delivery dashboard if not signed in', function(done) {
		// Create new Delivery dashboard model instance
		var deliveryDashboardObj = new DeliveryDashboard(deliveryDashboard);

		// Save the Delivery dashboard
		deliveryDashboardObj.save(function() {
			request(app).get('/delivery-dashboards/' + deliveryDashboardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', deliveryDashboard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Delivery dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery dashboard
				agent.post('/delivery-dashboards')
					.send(deliveryDashboard)
					.expect(200)
					.end(function(deliveryDashboardSaveErr, deliveryDashboardSaveRes) {
						// Handle Delivery dashboard save error
						if (deliveryDashboardSaveErr) done(deliveryDashboardSaveErr);

						// Delete existing Delivery dashboard
						agent.delete('/delivery-dashboards/' + deliveryDashboardSaveRes.body._id)
							.send(deliveryDashboard)
							.expect(200)
							.end(function(deliveryDashboardDeleteErr, deliveryDashboardDeleteRes) {
								// Handle Delivery dashboard error error
								if (deliveryDashboardDeleteErr) done(deliveryDashboardDeleteErr);

								// Set assertions
								(deliveryDashboardDeleteRes.body._id).should.equal(deliveryDashboardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Delivery dashboard instance if not signed in', function(done) {
		// Set Delivery dashboard user 
		deliveryDashboard.user = user;

		// Create new Delivery dashboard model instance
		var deliveryDashboardObj = new DeliveryDashboard(deliveryDashboard);

		// Save the Delivery dashboard
		deliveryDashboardObj.save(function() {
			// Try deleting Delivery dashboard
			request(app).delete('/delivery-dashboards/' + deliveryDashboardObj._id)
			.expect(401)
			.end(function(deliveryDashboardDeleteErr, deliveryDashboardDeleteRes) {
				// Set message assertion
				(deliveryDashboardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Delivery dashboard error error
				done(deliveryDashboardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		DeliveryDashboard.remove().exec();
		done();
	});
});