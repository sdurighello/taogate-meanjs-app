'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioIssue = mongoose.model('PortfolioIssue'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioIssue;

/**
 * Portfolio issue routes tests
 */
describe('Portfolio issue CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio issue
		user.save(function() {
			portfolioIssue = {
				name: 'Portfolio issue Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio issue instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio issue
				agent.post('/portfolio-issues')
					.send(portfolioIssue)
					.expect(200)
					.end(function(portfolioIssueSaveErr, portfolioIssueSaveRes) {
						// Handle Portfolio issue save error
						if (portfolioIssueSaveErr) done(portfolioIssueSaveErr);

						// Get a list of Portfolio issues
						agent.get('/portfolio-issues')
							.end(function(portfolioIssuesGetErr, portfolioIssuesGetRes) {
								// Handle Portfolio issue save error
								if (portfolioIssuesGetErr) done(portfolioIssuesGetErr);

								// Get Portfolio issues list
								var portfolioIssues = portfolioIssuesGetRes.body;

								// Set assertions
								(portfolioIssues[0].user._id).should.equal(userId);
								(portfolioIssues[0].name).should.match('Portfolio issue Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio issue instance if not logged in', function(done) {
		agent.post('/portfolio-issues')
			.send(portfolioIssue)
			.expect(401)
			.end(function(portfolioIssueSaveErr, portfolioIssueSaveRes) {
				// Call the assertion callback
				done(portfolioIssueSaveErr);
			});
	});

	it('should not be able to save Portfolio issue instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioIssue.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio issue
				agent.post('/portfolio-issues')
					.send(portfolioIssue)
					.expect(400)
					.end(function(portfolioIssueSaveErr, portfolioIssueSaveRes) {
						// Set message assertion
						(portfolioIssueSaveRes.body.message).should.match('Please fill Portfolio issue name');
						
						// Handle Portfolio issue save error
						done(portfolioIssueSaveErr);
					});
			});
	});

	it('should be able to update Portfolio issue instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio issue
				agent.post('/portfolio-issues')
					.send(portfolioIssue)
					.expect(200)
					.end(function(portfolioIssueSaveErr, portfolioIssueSaveRes) {
						// Handle Portfolio issue save error
						if (portfolioIssueSaveErr) done(portfolioIssueSaveErr);

						// Update Portfolio issue name
						portfolioIssue.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio issue
						agent.put('/portfolio-issues/' + portfolioIssueSaveRes.body._id)
							.send(portfolioIssue)
							.expect(200)
							.end(function(portfolioIssueUpdateErr, portfolioIssueUpdateRes) {
								// Handle Portfolio issue update error
								if (portfolioIssueUpdateErr) done(portfolioIssueUpdateErr);

								// Set assertions
								(portfolioIssueUpdateRes.body._id).should.equal(portfolioIssueSaveRes.body._id);
								(portfolioIssueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio issues if not signed in', function(done) {
		// Create new Portfolio issue model instance
		var portfolioIssueObj = new PortfolioIssue(portfolioIssue);

		// Save the Portfolio issue
		portfolioIssueObj.save(function() {
			// Request Portfolio issues
			request(app).get('/portfolio-issues')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio issue if not signed in', function(done) {
		// Create new Portfolio issue model instance
		var portfolioIssueObj = new PortfolioIssue(portfolioIssue);

		// Save the Portfolio issue
		portfolioIssueObj.save(function() {
			request(app).get('/portfolio-issues/' + portfolioIssueObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioIssue.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio issue instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio issue
				agent.post('/portfolio-issues')
					.send(portfolioIssue)
					.expect(200)
					.end(function(portfolioIssueSaveErr, portfolioIssueSaveRes) {
						// Handle Portfolio issue save error
						if (portfolioIssueSaveErr) done(portfolioIssueSaveErr);

						// Delete existing Portfolio issue
						agent.delete('/portfolio-issues/' + portfolioIssueSaveRes.body._id)
							.send(portfolioIssue)
							.expect(200)
							.end(function(portfolioIssueDeleteErr, portfolioIssueDeleteRes) {
								// Handle Portfolio issue error error
								if (portfolioIssueDeleteErr) done(portfolioIssueDeleteErr);

								// Set assertions
								(portfolioIssueDeleteRes.body._id).should.equal(portfolioIssueSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio issue instance if not signed in', function(done) {
		// Set Portfolio issue user 
		portfolioIssue.user = user;

		// Create new Portfolio issue model instance
		var portfolioIssueObj = new PortfolioIssue(portfolioIssue);

		// Save the Portfolio issue
		portfolioIssueObj.save(function() {
			// Try deleting Portfolio issue
			request(app).delete('/portfolio-issues/' + portfolioIssueObj._id)
			.expect(401)
			.end(function(portfolioIssueDeleteErr, portfolioIssueDeleteRes) {
				// Set message assertion
				(portfolioIssueDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio issue error error
				done(portfolioIssueDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioIssue.remove().exec();
		done();
	});
});