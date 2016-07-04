'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogSummary = mongoose.model('LogSummary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logSummary;

/**
 * Log summary routes tests
 */
describe('Log summary CRUD tests', function() {
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

		// Save a user to the test db and create new Log summary
		user.save(function() {
			logSummary = {
				name: 'Log summary Name'
			};

			done();
		});
	});

	it('should be able to save Log summary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log summary
				agent.post('/log-summaries')
					.send(logSummary)
					.expect(200)
					.end(function(logSummarySaveErr, logSummarySaveRes) {
						// Handle Log summary save error
						if (logSummarySaveErr) done(logSummarySaveErr);

						// Get a list of Log summaries
						agent.get('/log-summaries')
							.end(function(logSummariesGetErr, logSummariesGetRes) {
								// Handle Log summary save error
								if (logSummariesGetErr) done(logSummariesGetErr);

								// Get Log summaries list
								var logSummaries = logSummariesGetRes.body;

								// Set assertions
								(logSummaries[0].user._id).should.equal(userId);
								(logSummaries[0].name).should.match('Log summary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Log summary instance if not logged in', function(done) {
		agent.post('/log-summaries')
			.send(logSummary)
			.expect(401)
			.end(function(logSummarySaveErr, logSummarySaveRes) {
				// Call the assertion callback
				done(logSummarySaveErr);
			});
	});

	it('should not be able to save Log summary instance if no name is provided', function(done) {
		// Invalidate name field
		logSummary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log summary
				agent.post('/log-summaries')
					.send(logSummary)
					.expect(400)
					.end(function(logSummarySaveErr, logSummarySaveRes) {
						// Set message assertion
						(logSummarySaveRes.body.message).should.match('Please fill Log summary name');
						
						// Handle Log summary save error
						done(logSummarySaveErr);
					});
			});
	});

	it('should be able to update Log summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log summary
				agent.post('/log-summaries')
					.send(logSummary)
					.expect(200)
					.end(function(logSummarySaveErr, logSummarySaveRes) {
						// Handle Log summary save error
						if (logSummarySaveErr) done(logSummarySaveErr);

						// Update Log summary name
						logSummary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Log summary
						agent.put('/log-summaries/' + logSummarySaveRes.body._id)
							.send(logSummary)
							.expect(200)
							.end(function(logSummaryUpdateErr, logSummaryUpdateRes) {
								// Handle Log summary update error
								if (logSummaryUpdateErr) done(logSummaryUpdateErr);

								// Set assertions
								(logSummaryUpdateRes.body._id).should.equal(logSummarySaveRes.body._id);
								(logSummaryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Log summaries if not signed in', function(done) {
		// Create new Log summary model instance
		var logSummaryObj = new LogSummary(logSummary);

		// Save the Log summary
		logSummaryObj.save(function() {
			// Request Log summaries
			request(app).get('/log-summaries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Log summary if not signed in', function(done) {
		// Create new Log summary model instance
		var logSummaryObj = new LogSummary(logSummary);

		// Save the Log summary
		logSummaryObj.save(function() {
			request(app).get('/log-summaries/' + logSummaryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logSummary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Log summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log summary
				agent.post('/log-summaries')
					.send(logSummary)
					.expect(200)
					.end(function(logSummarySaveErr, logSummarySaveRes) {
						// Handle Log summary save error
						if (logSummarySaveErr) done(logSummarySaveErr);

						// Delete existing Log summary
						agent.delete('/log-summaries/' + logSummarySaveRes.body._id)
							.send(logSummary)
							.expect(200)
							.end(function(logSummaryDeleteErr, logSummaryDeleteRes) {
								// Handle Log summary error error
								if (logSummaryDeleteErr) done(logSummaryDeleteErr);

								// Set assertions
								(logSummaryDeleteRes.body._id).should.equal(logSummarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Log summary instance if not signed in', function(done) {
		// Set Log summary user 
		logSummary.user = user;

		// Create new Log summary model instance
		var logSummaryObj = new LogSummary(logSummary);

		// Save the Log summary
		logSummaryObj.save(function() {
			// Try deleting Log summary
			request(app).delete('/log-summaries/' + logSummaryObj._id)
			.expect(401)
			.end(function(logSummaryDeleteErr, logSummaryDeleteRes) {
				// Set message assertion
				(logSummaryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Log summary error error
				done(logSummaryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LogSummary.remove().exec();
		done();
	});
});