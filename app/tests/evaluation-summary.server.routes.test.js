'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EvaluationSummary = mongoose.model('EvaluationSummary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, evaluationSummary;

/**
 * Evaluation summary routes tests
 */
describe('Evaluation summary CRUD tests', function() {
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

		// Save a user to the test db and create new Evaluation summary
		user.save(function() {
			evaluationSummary = {
				name: 'Evaluation summary Name'
			};

			done();
		});
	});

	it('should be able to save Evaluation summary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation summary
				agent.post('/evaluation-summaries')
					.send(evaluationSummary)
					.expect(200)
					.end(function(evaluationSummarySaveErr, evaluationSummarySaveRes) {
						// Handle Evaluation summary save error
						if (evaluationSummarySaveErr) done(evaluationSummarySaveErr);

						// Get a list of Evaluation summaries
						agent.get('/evaluation-summaries')
							.end(function(evaluationSummariesGetErr, evaluationSummariesGetRes) {
								// Handle Evaluation summary save error
								if (evaluationSummariesGetErr) done(evaluationSummariesGetErr);

								// Get Evaluation summaries list
								var evaluationSummaries = evaluationSummariesGetRes.body;

								// Set assertions
								(evaluationSummaries[0].user._id).should.equal(userId);
								(evaluationSummaries[0].name).should.match('Evaluation summary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Evaluation summary instance if not logged in', function(done) {
		agent.post('/evaluation-summaries')
			.send(evaluationSummary)
			.expect(401)
			.end(function(evaluationSummarySaveErr, evaluationSummarySaveRes) {
				// Call the assertion callback
				done(evaluationSummarySaveErr);
			});
	});

	it('should not be able to save Evaluation summary instance if no name is provided', function(done) {
		// Invalidate name field
		evaluationSummary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation summary
				agent.post('/evaluation-summaries')
					.send(evaluationSummary)
					.expect(400)
					.end(function(evaluationSummarySaveErr, evaluationSummarySaveRes) {
						// Set message assertion
						(evaluationSummarySaveRes.body.message).should.match('Please fill Evaluation summary name');
						
						// Handle Evaluation summary save error
						done(evaluationSummarySaveErr);
					});
			});
	});

	it('should be able to update Evaluation summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation summary
				agent.post('/evaluation-summaries')
					.send(evaluationSummary)
					.expect(200)
					.end(function(evaluationSummarySaveErr, evaluationSummarySaveRes) {
						// Handle Evaluation summary save error
						if (evaluationSummarySaveErr) done(evaluationSummarySaveErr);

						// Update Evaluation summary name
						evaluationSummary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Evaluation summary
						agent.put('/evaluation-summaries/' + evaluationSummarySaveRes.body._id)
							.send(evaluationSummary)
							.expect(200)
							.end(function(evaluationSummaryUpdateErr, evaluationSummaryUpdateRes) {
								// Handle Evaluation summary update error
								if (evaluationSummaryUpdateErr) done(evaluationSummaryUpdateErr);

								// Set assertions
								(evaluationSummaryUpdateRes.body._id).should.equal(evaluationSummarySaveRes.body._id);
								(evaluationSummaryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Evaluation summaries if not signed in', function(done) {
		// Create new Evaluation summary model instance
		var evaluationSummaryObj = new EvaluationSummary(evaluationSummary);

		// Save the Evaluation summary
		evaluationSummaryObj.save(function() {
			// Request Evaluation summaries
			request(app).get('/evaluation-summaries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Evaluation summary if not signed in', function(done) {
		// Create new Evaluation summary model instance
		var evaluationSummaryObj = new EvaluationSummary(evaluationSummary);

		// Save the Evaluation summary
		evaluationSummaryObj.save(function() {
			request(app).get('/evaluation-summaries/' + evaluationSummaryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', evaluationSummary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Evaluation summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evaluation summary
				agent.post('/evaluation-summaries')
					.send(evaluationSummary)
					.expect(200)
					.end(function(evaluationSummarySaveErr, evaluationSummarySaveRes) {
						// Handle Evaluation summary save error
						if (evaluationSummarySaveErr) done(evaluationSummarySaveErr);

						// Delete existing Evaluation summary
						agent.delete('/evaluation-summaries/' + evaluationSummarySaveRes.body._id)
							.send(evaluationSummary)
							.expect(200)
							.end(function(evaluationSummaryDeleteErr, evaluationSummaryDeleteRes) {
								// Handle Evaluation summary error error
								if (evaluationSummaryDeleteErr) done(evaluationSummaryDeleteErr);

								// Set assertions
								(evaluationSummaryDeleteRes.body._id).should.equal(evaluationSummarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Evaluation summary instance if not signed in', function(done) {
		// Set Evaluation summary user 
		evaluationSummary.user = user;

		// Create new Evaluation summary model instance
		var evaluationSummaryObj = new EvaluationSummary(evaluationSummary);

		// Save the Evaluation summary
		evaluationSummaryObj.save(function() {
			// Try deleting Evaluation summary
			request(app).delete('/evaluation-summaries/' + evaluationSummaryObj._id)
			.expect(401)
			.end(function(evaluationSummaryDeleteErr, evaluationSummaryDeleteRes) {
				// Set message assertion
				(evaluationSummaryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Evaluation summary error error
				done(evaluationSummaryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EvaluationSummary.remove().exec();
		done();
	});
});