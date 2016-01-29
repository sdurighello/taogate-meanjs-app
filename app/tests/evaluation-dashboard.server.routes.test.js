'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EvaluationDashboard = mongoose.model('EvaluationDashboard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, evaluationDashboard;

/**
 * Evaluation dashboard routes tests
 */
describe('Evaluation dashboard CRUD tests', function() {
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

		// Save a user to the test db and create new Evaluation dashboard
		user.save(function() {
			evaluationDashboard = {
				name: 'Evaluation dashboard Name'
			};

			done();
		});
	});

	it('should be able to save Evaluation dashboard instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation dashboard
				agent.post('/evaluation-dashboards')
					.send(evaluationDashboard)
					.expect(200)
					.end(function(evaluationDashboardSaveErr, evaluationDashboardSaveRes) {
						// Handle Evaluation dashboard save error
						if (evaluationDashboardSaveErr) done(evaluationDashboardSaveErr);

						// Get a list of Evaluation dashboards
						agent.get('/evaluation-dashboards')
							.end(function(evaluationDashboardsGetErr, evaluationDashboardsGetRes) {
								// Handle Evaluation dashboard save error
								if (evaluationDashboardsGetErr) done(evaluationDashboardsGetErr);

								// Get Evaluation dashboards list
								var evaluationDashboards = evaluationDashboardsGetRes.body;

								// Set assertions
								(evaluationDashboards[0].user._id).should.equal(userId);
								(evaluationDashboards[0].name).should.match('Evaluation dashboard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Evaluation dashboard instance if not logged in', function(done) {
		agent.post('/evaluation-dashboards')
			.send(evaluationDashboard)
			.expect(401)
			.end(function(evaluationDashboardSaveErr, evaluationDashboardSaveRes) {
				// Call the assertion callback
				done(evaluationDashboardSaveErr);
			});
	});

	it('should not be able to save Evaluation dashboard instance if no name is provided', function(done) {
		// Invalidate name field
		evaluationDashboard.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation dashboard
				agent.post('/evaluation-dashboards')
					.send(evaluationDashboard)
					.expect(400)
					.end(function(evaluationDashboardSaveErr, evaluationDashboardSaveRes) {
						// Set message assertion
						(evaluationDashboardSaveRes.body.message).should.match('Please fill Evaluation dashboard name');
						
						// Handle Evaluation dashboard save error
						done(evaluationDashboardSaveErr);
					});
			});
	});

	it('should be able to update Evaluation dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation dashboard
				agent.post('/evaluation-dashboards')
					.send(evaluationDashboard)
					.expect(200)
					.end(function(evaluationDashboardSaveErr, evaluationDashboardSaveRes) {
						// Handle Evaluation dashboard save error
						if (evaluationDashboardSaveErr) done(evaluationDashboardSaveErr);

						// Update Evaluation dashboard name
						evaluationDashboard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Evaluation dashboard
						agent.put('/evaluation-dashboards/' + evaluationDashboardSaveRes.body._id)
							.send(evaluationDashboard)
							.expect(200)
							.end(function(evaluationDashboardUpdateErr, evaluationDashboardUpdateRes) {
								// Handle Evaluation dashboard update error
								if (evaluationDashboardUpdateErr) done(evaluationDashboardUpdateErr);

								// Set assertions
								(evaluationDashboardUpdateRes.body._id).should.equal(evaluationDashboardSaveRes.body._id);
								(evaluationDashboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Evaluation dashboards if not signed in', function(done) {
		// Create new Evaluation dashboard model instance
		var evaluationDashboardObj = new EvaluationDashboard(evaluationDashboard);

		// Save the Evaluation dashboard
		evaluationDashboardObj.save(function() {
			// Request Evaluation dashboards
			request(app).get('/evaluation-dashboards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Evaluation dashboard if not signed in', function(done) {
		// Create new Evaluation dashboard model instance
		var evaluationDashboardObj = new EvaluationDashboard(evaluationDashboard);

		// Save the Evaluation dashboard
		evaluationDashboardObj.save(function() {
			request(app).get('/evaluation-dashboards/' + evaluationDashboardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', evaluationDashboard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Evaluation dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation dashboard
				agent.post('/evaluation-dashboards')
					.send(evaluationDashboard)
					.expect(200)
					.end(function(evaluationDashboardSaveErr, evaluationDashboardSaveRes) {
						// Handle Evaluation dashboard save error
						if (evaluationDashboardSaveErr) done(evaluationDashboardSaveErr);

						// Delete existing Evaluation dashboard
						agent.delete('/evaluation-dashboards/' + evaluationDashboardSaveRes.body._id)
							.send(evaluationDashboard)
							.expect(200)
							.end(function(evaluationDashboardDeleteErr, evaluationDashboardDeleteRes) {
								// Handle Evaluation dashboard error error
								if (evaluationDashboardDeleteErr) done(evaluationDashboardDeleteErr);

								// Set assertions
								(evaluationDashboardDeleteRes.body._id).should.equal(evaluationDashboardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Evaluation dashboard instance if not signed in', function(done) {
		// Set Evaluation dashboard user 
		evaluationDashboard.user = user;

		// Create new Evaluation dashboard model instance
		var evaluationDashboardObj = new EvaluationDashboard(evaluationDashboard);

		// Save the Evaluation dashboard
		evaluationDashboardObj.save(function() {
			// Try deleting Evaluation dashboard
			request(app).delete('/evaluation-dashboards/' + evaluationDashboardObj._id)
			.expect(401)
			.end(function(evaluationDashboardDeleteErr, evaluationDashboardDeleteRes) {
				// Set message assertion
				(evaluationDashboardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Evaluation dashboard error error
				done(evaluationDashboardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EvaluationDashboard.remove().exec();
		done();
	});
});