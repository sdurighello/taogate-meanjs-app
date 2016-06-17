'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioStatusUpdate = mongoose.model('PortfolioStatusUpdate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioStatusUpdate;

/**
 * Portfolio status update routes tests
 */
describe('Portfolio status update CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio status update
		user.save(function() {
			portfolioStatusUpdate = {
				name: 'Portfolio status update Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio status update instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status update
				agent.post('/portfolio-status-updates')
					.send(portfolioStatusUpdate)
					.expect(200)
					.end(function(portfolioStatusUpdateSaveErr, portfolioStatusUpdateSaveRes) {
						// Handle Portfolio status update save error
						if (portfolioStatusUpdateSaveErr) done(portfolioStatusUpdateSaveErr);

						// Get a list of Portfolio status updates
						agent.get('/portfolio-status-updates')
							.end(function(portfolioStatusUpdatesGetErr, portfolioStatusUpdatesGetRes) {
								// Handle Portfolio status update save error
								if (portfolioStatusUpdatesGetErr) done(portfolioStatusUpdatesGetErr);

								// Get Portfolio status updates list
								var portfolioStatusUpdates = portfolioStatusUpdatesGetRes.body;

								// Set assertions
								(portfolioStatusUpdates[0].user._id).should.equal(userId);
								(portfolioStatusUpdates[0].name).should.match('Portfolio status update Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio status update instance if not logged in', function(done) {
		agent.post('/portfolio-status-updates')
			.send(portfolioStatusUpdate)
			.expect(401)
			.end(function(portfolioStatusUpdateSaveErr, portfolioStatusUpdateSaveRes) {
				// Call the assertion callback
				done(portfolioStatusUpdateSaveErr);
			});
	});

	it('should not be able to save Portfolio status update instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioStatusUpdate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status update
				agent.post('/portfolio-status-updates')
					.send(portfolioStatusUpdate)
					.expect(400)
					.end(function(portfolioStatusUpdateSaveErr, portfolioStatusUpdateSaveRes) {
						// Set message assertion
						(portfolioStatusUpdateSaveRes.body.message).should.match('Please fill Portfolio status update name');
						
						// Handle Portfolio status update save error
						done(portfolioStatusUpdateSaveErr);
					});
			});
	});

	it('should be able to update Portfolio status update instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status update
				agent.post('/portfolio-status-updates')
					.send(portfolioStatusUpdate)
					.expect(200)
					.end(function(portfolioStatusUpdateSaveErr, portfolioStatusUpdateSaveRes) {
						// Handle Portfolio status update save error
						if (portfolioStatusUpdateSaveErr) done(portfolioStatusUpdateSaveErr);

						// Update Portfolio status update name
						portfolioStatusUpdate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio status update
						agent.put('/portfolio-status-updates/' + portfolioStatusUpdateSaveRes.body._id)
							.send(portfolioStatusUpdate)
							.expect(200)
							.end(function(portfolioStatusUpdateUpdateErr, portfolioStatusUpdateUpdateRes) {
								// Handle Portfolio status update update error
								if (portfolioStatusUpdateUpdateErr) done(portfolioStatusUpdateUpdateErr);

								// Set assertions
								(portfolioStatusUpdateUpdateRes.body._id).should.equal(portfolioStatusUpdateSaveRes.body._id);
								(portfolioStatusUpdateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio status updates if not signed in', function(done) {
		// Create new Portfolio status update model instance
		var portfolioStatusUpdateObj = new PortfolioStatusUpdate(portfolioStatusUpdate);

		// Save the Portfolio status update
		portfolioStatusUpdateObj.save(function() {
			// Request Portfolio status updates
			request(app).get('/portfolio-status-updates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio status update if not signed in', function(done) {
		// Create new Portfolio status update model instance
		var portfolioStatusUpdateObj = new PortfolioStatusUpdate(portfolioStatusUpdate);

		// Save the Portfolio status update
		portfolioStatusUpdateObj.save(function() {
			request(app).get('/portfolio-status-updates/' + portfolioStatusUpdateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioStatusUpdate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio status update instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status update
				agent.post('/portfolio-status-updates')
					.send(portfolioStatusUpdate)
					.expect(200)
					.end(function(portfolioStatusUpdateSaveErr, portfolioStatusUpdateSaveRes) {
						// Handle Portfolio status update save error
						if (portfolioStatusUpdateSaveErr) done(portfolioStatusUpdateSaveErr);

						// Delete existing Portfolio status update
						agent.delete('/portfolio-status-updates/' + portfolioStatusUpdateSaveRes.body._id)
							.send(portfolioStatusUpdate)
							.expect(200)
							.end(function(portfolioStatusUpdateDeleteErr, portfolioStatusUpdateDeleteRes) {
								// Handle Portfolio status update error error
								if (portfolioStatusUpdateDeleteErr) done(portfolioStatusUpdateDeleteErr);

								// Set assertions
								(portfolioStatusUpdateDeleteRes.body._id).should.equal(portfolioStatusUpdateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio status update instance if not signed in', function(done) {
		// Set Portfolio status update user 
		portfolioStatusUpdate.user = user;

		// Create new Portfolio status update model instance
		var portfolioStatusUpdateObj = new PortfolioStatusUpdate(portfolioStatusUpdate);

		// Save the Portfolio status update
		portfolioStatusUpdateObj.save(function() {
			// Try deleting Portfolio status update
			request(app).delete('/portfolio-status-updates/' + portfolioStatusUpdateObj._id)
			.expect(401)
			.end(function(portfolioStatusUpdateDeleteErr, portfolioStatusUpdateDeleteRes) {
				// Set message assertion
				(portfolioStatusUpdateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio status update error error
				done(portfolioStatusUpdateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioStatusUpdate.remove().exec();
		done();
	});
});