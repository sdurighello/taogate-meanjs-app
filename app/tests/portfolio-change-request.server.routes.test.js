'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioChangeRequest = mongoose.model('PortfolioChangeRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioChangeRequest;

/**
 * Portfolio change request routes tests
 */
describe('Portfolio change request CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio change request
		user.save(function() {
			portfolioChangeRequest = {
				name: 'Portfolio change request Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio change request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio change request
				agent.post('/portfolio-change-requests')
					.send(portfolioChangeRequest)
					.expect(200)
					.end(function(portfolioChangeRequestSaveErr, portfolioChangeRequestSaveRes) {
						// Handle Portfolio change request save error
						if (portfolioChangeRequestSaveErr) done(portfolioChangeRequestSaveErr);

						// Get a list of Portfolio change requests
						agent.get('/portfolio-change-requests')
							.end(function(portfolioChangeRequestsGetErr, portfolioChangeRequestsGetRes) {
								// Handle Portfolio change request save error
								if (portfolioChangeRequestsGetErr) done(portfolioChangeRequestsGetErr);

								// Get Portfolio change requests list
								var portfolioChangeRequests = portfolioChangeRequestsGetRes.body;

								// Set assertions
								(portfolioChangeRequests[0].user._id).should.equal(userId);
								(portfolioChangeRequests[0].name).should.match('Portfolio change request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio change request instance if not logged in', function(done) {
		agent.post('/portfolio-change-requests')
			.send(portfolioChangeRequest)
			.expect(401)
			.end(function(portfolioChangeRequestSaveErr, portfolioChangeRequestSaveRes) {
				// Call the assertion callback
				done(portfolioChangeRequestSaveErr);
			});
	});

	it('should not be able to save Portfolio change request instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioChangeRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio change request
				agent.post('/portfolio-change-requests')
					.send(portfolioChangeRequest)
					.expect(400)
					.end(function(portfolioChangeRequestSaveErr, portfolioChangeRequestSaveRes) {
						// Set message assertion
						(portfolioChangeRequestSaveRes.body.message).should.match('Please fill Portfolio change request name');
						
						// Handle Portfolio change request save error
						done(portfolioChangeRequestSaveErr);
					});
			});
	});

	it('should be able to update Portfolio change request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio change request
				agent.post('/portfolio-change-requests')
					.send(portfolioChangeRequest)
					.expect(200)
					.end(function(portfolioChangeRequestSaveErr, portfolioChangeRequestSaveRes) {
						// Handle Portfolio change request save error
						if (portfolioChangeRequestSaveErr) done(portfolioChangeRequestSaveErr);

						// Update Portfolio change request name
						portfolioChangeRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio change request
						agent.put('/portfolio-change-requests/' + portfolioChangeRequestSaveRes.body._id)
							.send(portfolioChangeRequest)
							.expect(200)
							.end(function(portfolioChangeRequestUpdateErr, portfolioChangeRequestUpdateRes) {
								// Handle Portfolio change request update error
								if (portfolioChangeRequestUpdateErr) done(portfolioChangeRequestUpdateErr);

								// Set assertions
								(portfolioChangeRequestUpdateRes.body._id).should.equal(portfolioChangeRequestSaveRes.body._id);
								(portfolioChangeRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio change requests if not signed in', function(done) {
		// Create new Portfolio change request model instance
		var portfolioChangeRequestObj = new PortfolioChangeRequest(portfolioChangeRequest);

		// Save the Portfolio change request
		portfolioChangeRequestObj.save(function() {
			// Request Portfolio change requests
			request(app).get('/portfolio-change-requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio change request if not signed in', function(done) {
		// Create new Portfolio change request model instance
		var portfolioChangeRequestObj = new PortfolioChangeRequest(portfolioChangeRequest);

		// Save the Portfolio change request
		portfolioChangeRequestObj.save(function() {
			request(app).get('/portfolio-change-requests/' + portfolioChangeRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioChangeRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio change request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio change request
				agent.post('/portfolio-change-requests')
					.send(portfolioChangeRequest)
					.expect(200)
					.end(function(portfolioChangeRequestSaveErr, portfolioChangeRequestSaveRes) {
						// Handle Portfolio change request save error
						if (portfolioChangeRequestSaveErr) done(portfolioChangeRequestSaveErr);

						// Delete existing Portfolio change request
						agent.delete('/portfolio-change-requests/' + portfolioChangeRequestSaveRes.body._id)
							.send(portfolioChangeRequest)
							.expect(200)
							.end(function(portfolioChangeRequestDeleteErr, portfolioChangeRequestDeleteRes) {
								// Handle Portfolio change request error error
								if (portfolioChangeRequestDeleteErr) done(portfolioChangeRequestDeleteErr);

								// Set assertions
								(portfolioChangeRequestDeleteRes.body._id).should.equal(portfolioChangeRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio change request instance if not signed in', function(done) {
		// Set Portfolio change request user 
		portfolioChangeRequest.user = user;

		// Create new Portfolio change request model instance
		var portfolioChangeRequestObj = new PortfolioChangeRequest(portfolioChangeRequest);

		// Save the Portfolio change request
		portfolioChangeRequestObj.save(function() {
			// Try deleting Portfolio change request
			request(app).delete('/portfolio-change-requests/' + portfolioChangeRequestObj._id)
			.expect(401)
			.end(function(portfolioChangeRequestDeleteErr, portfolioChangeRequestDeleteRes) {
				// Set message assertion
				(portfolioChangeRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio change request error error
				done(portfolioChangeRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioChangeRequest.remove().exec();
		done();
	});
});