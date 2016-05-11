'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	StatusSummary = mongoose.model('StatusSummary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, statusSummary;

/**
 * Status summary routes tests
 */
describe('Status summary CRUD tests', function() {
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

		// Save a user to the test db and create new Status summary
		user.save(function() {
			statusSummary = {
				name: 'Status summary Name'
			};

			done();
		});
	});

	it('should be able to save Status summary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status summary
				agent.post('/status-summaries')
					.send(statusSummary)
					.expect(200)
					.end(function(statusSummarySaveErr, statusSummarySaveRes) {
						// Handle Status summary save error
						if (statusSummarySaveErr) done(statusSummarySaveErr);

						// Get a list of Status summaries
						agent.get('/status-summaries')
							.end(function(statusSummariesGetErr, statusSummariesGetRes) {
								// Handle Status summary save error
								if (statusSummariesGetErr) done(statusSummariesGetErr);

								// Get Status summaries list
								var statusSummaries = statusSummariesGetRes.body;

								// Set assertions
								(statusSummaries[0].user._id).should.equal(userId);
								(statusSummaries[0].name).should.match('Status summary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Status summary instance if not logged in', function(done) {
		agent.post('/status-summaries')
			.send(statusSummary)
			.expect(401)
			.end(function(statusSummarySaveErr, statusSummarySaveRes) {
				// Call the assertion callback
				done(statusSummarySaveErr);
			});
	});

	it('should not be able to save Status summary instance if no name is provided', function(done) {
		// Invalidate name field
		statusSummary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status summary
				agent.post('/status-summaries')
					.send(statusSummary)
					.expect(400)
					.end(function(statusSummarySaveErr, statusSummarySaveRes) {
						// Set message assertion
						(statusSummarySaveRes.body.message).should.match('Please fill Status summary name');
						
						// Handle Status summary save error
						done(statusSummarySaveErr);
					});
			});
	});

	it('should be able to update Status summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status summary
				agent.post('/status-summaries')
					.send(statusSummary)
					.expect(200)
					.end(function(statusSummarySaveErr, statusSummarySaveRes) {
						// Handle Status summary save error
						if (statusSummarySaveErr) done(statusSummarySaveErr);

						// Update Status summary name
						statusSummary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Status summary
						agent.put('/status-summaries/' + statusSummarySaveRes.body._id)
							.send(statusSummary)
							.expect(200)
							.end(function(statusSummaryUpdateErr, statusSummaryUpdateRes) {
								// Handle Status summary update error
								if (statusSummaryUpdateErr) done(statusSummaryUpdateErr);

								// Set assertions
								(statusSummaryUpdateRes.body._id).should.equal(statusSummarySaveRes.body._id);
								(statusSummaryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Status summaries if not signed in', function(done) {
		// Create new Status summary model instance
		var statusSummaryObj = new StatusSummary(statusSummary);

		// Save the Status summary
		statusSummaryObj.save(function() {
			// Request Status summaries
			request(app).get('/status-summaries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Status summary if not signed in', function(done) {
		// Create new Status summary model instance
		var statusSummaryObj = new StatusSummary(statusSummary);

		// Save the Status summary
		statusSummaryObj.save(function() {
			request(app).get('/status-summaries/' + statusSummaryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', statusSummary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Status summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status summary
				agent.post('/status-summaries')
					.send(statusSummary)
					.expect(200)
					.end(function(statusSummarySaveErr, statusSummarySaveRes) {
						// Handle Status summary save error
						if (statusSummarySaveErr) done(statusSummarySaveErr);

						// Delete existing Status summary
						agent.delete('/status-summaries/' + statusSummarySaveRes.body._id)
							.send(statusSummary)
							.expect(200)
							.end(function(statusSummaryDeleteErr, statusSummaryDeleteRes) {
								// Handle Status summary error error
								if (statusSummaryDeleteErr) done(statusSummaryDeleteErr);

								// Set assertions
								(statusSummaryDeleteRes.body._id).should.equal(statusSummarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Status summary instance if not signed in', function(done) {
		// Set Status summary user 
		statusSummary.user = user;

		// Create new Status summary model instance
		var statusSummaryObj = new StatusSummary(statusSummary);

		// Save the Status summary
		statusSummaryObj.save(function() {
			// Try deleting Status summary
			request(app).delete('/status-summaries/' + statusSummaryObj._id)
			.expect(401)
			.end(function(statusSummaryDeleteErr, statusSummaryDeleteRes) {
				// Set message assertion
				(statusSummaryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Status summary error error
				done(statusSummaryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		StatusSummary.remove().exec();
		done();
	});
});