'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DefinitionDashboard = mongoose.model('DefinitionDashboard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, definitionDashboard;

/**
 * Definition dashboard routes tests
 */
describe('Definition dashboard CRUD tests', function() {
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

		// Save a user to the test db and create new Definition dashboard
		user.save(function() {
			definitionDashboard = {
				name: 'Definition dashboard Name'
			};

			done();
		});
	});

	it('should be able to save Definition dashboard instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Definition dashboard
				agent.post('/definition-dashboards')
					.send(definitionDashboard)
					.expect(200)
					.end(function(definitionDashboardSaveErr, definitionDashboardSaveRes) {
						// Handle Definition dashboard save error
						if (definitionDashboardSaveErr) done(definitionDashboardSaveErr);

						// Get a list of Definition dashboards
						agent.get('/definition-dashboards')
							.end(function(definitionDashboardsGetErr, definitionDashboardsGetRes) {
								// Handle Definition dashboard save error
								if (definitionDashboardsGetErr) done(definitionDashboardsGetErr);

								// Get Definition dashboards list
								var definitionDashboards = definitionDashboardsGetRes.body;

								// Set assertions
								(definitionDashboards[0].user._id).should.equal(userId);
								(definitionDashboards[0].name).should.match('Definition dashboard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Definition dashboard instance if not logged in', function(done) {
		agent.post('/definition-dashboards')
			.send(definitionDashboard)
			.expect(401)
			.end(function(definitionDashboardSaveErr, definitionDashboardSaveRes) {
				// Call the assertion callback
				done(definitionDashboardSaveErr);
			});
	});

	it('should not be able to save Definition dashboard instance if no name is provided', function(done) {
		// Invalidate name field
		definitionDashboard.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Definition dashboard
				agent.post('/definition-dashboards')
					.send(definitionDashboard)
					.expect(400)
					.end(function(definitionDashboardSaveErr, definitionDashboardSaveRes) {
						// Set message assertion
						(definitionDashboardSaveRes.body.message).should.match('Please fill Definition dashboard name');
						
						// Handle Definition dashboard save error
						done(definitionDashboardSaveErr);
					});
			});
	});

	it('should be able to update Definition dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Definition dashboard
				agent.post('/definition-dashboards')
					.send(definitionDashboard)
					.expect(200)
					.end(function(definitionDashboardSaveErr, definitionDashboardSaveRes) {
						// Handle Definition dashboard save error
						if (definitionDashboardSaveErr) done(definitionDashboardSaveErr);

						// Update Definition dashboard name
						definitionDashboard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Definition dashboard
						agent.put('/definition-dashboards/' + definitionDashboardSaveRes.body._id)
							.send(definitionDashboard)
							.expect(200)
							.end(function(definitionDashboardUpdateErr, definitionDashboardUpdateRes) {
								// Handle Definition dashboard update error
								if (definitionDashboardUpdateErr) done(definitionDashboardUpdateErr);

								// Set assertions
								(definitionDashboardUpdateRes.body._id).should.equal(definitionDashboardSaveRes.body._id);
								(definitionDashboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Definition dashboards if not signed in', function(done) {
		// Create new Definition dashboard model instance
		var definitionDashboardObj = new DefinitionDashboard(definitionDashboard);

		// Save the Definition dashboard
		definitionDashboardObj.save(function() {
			// Request Definition dashboards
			request(app).get('/definition-dashboards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Definition dashboard if not signed in', function(done) {
		// Create new Definition dashboard model instance
		var definitionDashboardObj = new DefinitionDashboard(definitionDashboard);

		// Save the Definition dashboard
		definitionDashboardObj.save(function() {
			request(app).get('/definition-dashboards/' + definitionDashboardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', definitionDashboard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Definition dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Definition dashboard
				agent.post('/definition-dashboards')
					.send(definitionDashboard)
					.expect(200)
					.end(function(definitionDashboardSaveErr, definitionDashboardSaveRes) {
						// Handle Definition dashboard save error
						if (definitionDashboardSaveErr) done(definitionDashboardSaveErr);

						// Delete existing Definition dashboard
						agent.delete('/definition-dashboards/' + definitionDashboardSaveRes.body._id)
							.send(definitionDashboard)
							.expect(200)
							.end(function(definitionDashboardDeleteErr, definitionDashboardDeleteRes) {
								// Handle Definition dashboard error error
								if (definitionDashboardDeleteErr) done(definitionDashboardDeleteErr);

								// Set assertions
								(definitionDashboardDeleteRes.body._id).should.equal(definitionDashboardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Definition dashboard instance if not signed in', function(done) {
		// Set Definition dashboard user 
		definitionDashboard.user = user;

		// Create new Definition dashboard model instance
		var definitionDashboardObj = new DefinitionDashboard(definitionDashboard);

		// Save the Definition dashboard
		definitionDashboardObj.save(function() {
			// Try deleting Definition dashboard
			request(app).delete('/definition-dashboards/' + definitionDashboardObj._id)
			.expect(401)
			.end(function(definitionDashboardDeleteErr, definitionDashboardDeleteRes) {
				// Set message assertion
				(definitionDashboardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Definition dashboard error error
				done(definitionDashboardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		DefinitionDashboard.remove().exec();
		done();
	});
});