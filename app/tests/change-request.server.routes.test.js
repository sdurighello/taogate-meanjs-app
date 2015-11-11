'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChangeRequest = mongoose.model('ChangeRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, changeRequest;

/**
 * Change request routes tests
 */
describe('Change request CRUD tests', function() {
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

		// Save a user to the test db and create new Change request
		user.save(function() {
			changeRequest = {
				name: 'Change request Name'
			};

			done();
		});
	});

	it('should be able to save Change request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request
				agent.post('/change-requests')
					.send(changeRequest)
					.expect(200)
					.end(function(changeRequestSaveErr, changeRequestSaveRes) {
						// Handle Change request save error
						if (changeRequestSaveErr) done(changeRequestSaveErr);

						// Get a list of Change requests
						agent.get('/change-requests')
							.end(function(changeRequestsGetErr, changeRequestsGetRes) {
								// Handle Change request save error
								if (changeRequestsGetErr) done(changeRequestsGetErr);

								// Get Change requests list
								var changeRequests = changeRequestsGetRes.body;

								// Set assertions
								(changeRequests[0].user._id).should.equal(userId);
								(changeRequests[0].name).should.match('Change request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Change request instance if not logged in', function(done) {
		agent.post('/change-requests')
			.send(changeRequest)
			.expect(401)
			.end(function(changeRequestSaveErr, changeRequestSaveRes) {
				// Call the assertion callback
				done(changeRequestSaveErr);
			});
	});

	it('should not be able to save Change request instance if no name is provided', function(done) {
		// Invalidate name field
		changeRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request
				agent.post('/change-requests')
					.send(changeRequest)
					.expect(400)
					.end(function(changeRequestSaveErr, changeRequestSaveRes) {
						// Set message assertion
						(changeRequestSaveRes.body.message).should.match('Please fill Change request name');
						
						// Handle Change request save error
						done(changeRequestSaveErr);
					});
			});
	});

	it('should be able to update Change request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request
				agent.post('/change-requests')
					.send(changeRequest)
					.expect(200)
					.end(function(changeRequestSaveErr, changeRequestSaveRes) {
						// Handle Change request save error
						if (changeRequestSaveErr) done(changeRequestSaveErr);

						// Update Change request name
						changeRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Change request
						agent.put('/change-requests/' + changeRequestSaveRes.body._id)
							.send(changeRequest)
							.expect(200)
							.end(function(changeRequestUpdateErr, changeRequestUpdateRes) {
								// Handle Change request update error
								if (changeRequestUpdateErr) done(changeRequestUpdateErr);

								// Set assertions
								(changeRequestUpdateRes.body._id).should.equal(changeRequestSaveRes.body._id);
								(changeRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Change requests if not signed in', function(done) {
		// Create new Change request model instance
		var changeRequestObj = new ChangeRequest(changeRequest);

		// Save the Change request
		changeRequestObj.save(function() {
			// Request Change requests
			request(app).get('/change-requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Change request if not signed in', function(done) {
		// Create new Change request model instance
		var changeRequestObj = new ChangeRequest(changeRequest);

		// Save the Change request
		changeRequestObj.save(function() {
			request(app).get('/change-requests/' + changeRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', changeRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Change request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request
				agent.post('/change-requests')
					.send(changeRequest)
					.expect(200)
					.end(function(changeRequestSaveErr, changeRequestSaveRes) {
						// Handle Change request save error
						if (changeRequestSaveErr) done(changeRequestSaveErr);

						// Delete existing Change request
						agent.delete('/change-requests/' + changeRequestSaveRes.body._id)
							.send(changeRequest)
							.expect(200)
							.end(function(changeRequestDeleteErr, changeRequestDeleteRes) {
								// Handle Change request error error
								if (changeRequestDeleteErr) done(changeRequestDeleteErr);

								// Set assertions
								(changeRequestDeleteRes.body._id).should.equal(changeRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Change request instance if not signed in', function(done) {
		// Set Change request user 
		changeRequest.user = user;

		// Create new Change request model instance
		var changeRequestObj = new ChangeRequest(changeRequest);

		// Save the Change request
		changeRequestObj.save(function() {
			// Try deleting Change request
			request(app).delete('/change-requests/' + changeRequestObj._id)
			.expect(401)
			.end(function(changeRequestDeleteErr, changeRequestDeleteRes) {
				// Set message assertion
				(changeRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Change request error error
				done(changeRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ChangeRequest.remove().exec();
		done();
	});
});