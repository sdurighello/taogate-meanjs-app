'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SelectionStatus = mongoose.model('SelectionStatus'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, selectionStatus;

/**
 * Selection status routes tests
 */
describe('Selection status CRUD tests', function() {
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

		// Save a user to the test db and create new Selection status
		user.save(function() {
			selectionStatus = {
				name: 'Selection status Name'
			};

			done();
		});
	});

	it('should be able to save Selection status instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection status
				agent.post('/selection-statuses')
					.send(selectionStatus)
					.expect(200)
					.end(function(selectionStatusSaveErr, selectionStatusSaveRes) {
						// Handle Selection status save error
						if (selectionStatusSaveErr) done(selectionStatusSaveErr);

						// Get a list of Selection statuses
						agent.get('/selection-statuses')
							.end(function(selectionStatusesGetErr, selectionStatusesGetRes) {
								// Handle Selection status save error
								if (selectionStatusesGetErr) done(selectionStatusesGetErr);

								// Get Selection statuses list
								var selectionStatuses = selectionStatusesGetRes.body;

								// Set assertions
								(selectionStatuses[0].user._id).should.equal(userId);
								(selectionStatuses[0].name).should.match('Selection status Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Selection status instance if not logged in', function(done) {
		agent.post('/selection-statuses')
			.send(selectionStatus)
			.expect(401)
			.end(function(selectionStatusSaveErr, selectionStatusSaveRes) {
				// Call the assertion callback
				done(selectionStatusSaveErr);
			});
	});

	it('should not be able to save Selection status instance if no name is provided', function(done) {
		// Invalidate name field
		selectionStatus.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection status
				agent.post('/selection-statuses')
					.send(selectionStatus)
					.expect(400)
					.end(function(selectionStatusSaveErr, selectionStatusSaveRes) {
						// Set message assertion
						(selectionStatusSaveRes.body.message).should.match('Please fill Selection status name');
						
						// Handle Selection status save error
						done(selectionStatusSaveErr);
					});
			});
	});

	it('should be able to update Selection status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection status
				agent.post('/selection-statuses')
					.send(selectionStatus)
					.expect(200)
					.end(function(selectionStatusSaveErr, selectionStatusSaveRes) {
						// Handle Selection status save error
						if (selectionStatusSaveErr) done(selectionStatusSaveErr);

						// Update Selection status name
						selectionStatus.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Selection status
						agent.put('/selection-statuses/' + selectionStatusSaveRes.body._id)
							.send(selectionStatus)
							.expect(200)
							.end(function(selectionStatusUpdateErr, selectionStatusUpdateRes) {
								// Handle Selection status update error
								if (selectionStatusUpdateErr) done(selectionStatusUpdateErr);

								// Set assertions
								(selectionStatusUpdateRes.body._id).should.equal(selectionStatusSaveRes.body._id);
								(selectionStatusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Selection statuses if not signed in', function(done) {
		// Create new Selection status model instance
		var selectionStatusObj = new SelectionStatus(selectionStatus);

		// Save the Selection status
		selectionStatusObj.save(function() {
			// Request Selection statuses
			request(app).get('/selection-statuses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Selection status if not signed in', function(done) {
		// Create new Selection status model instance
		var selectionStatusObj = new SelectionStatus(selectionStatus);

		// Save the Selection status
		selectionStatusObj.save(function() {
			request(app).get('/selection-statuses/' + selectionStatusObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', selectionStatus.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Selection status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection status
				agent.post('/selection-statuses')
					.send(selectionStatus)
					.expect(200)
					.end(function(selectionStatusSaveErr, selectionStatusSaveRes) {
						// Handle Selection status save error
						if (selectionStatusSaveErr) done(selectionStatusSaveErr);

						// Delete existing Selection status
						agent.delete('/selection-statuses/' + selectionStatusSaveRes.body._id)
							.send(selectionStatus)
							.expect(200)
							.end(function(selectionStatusDeleteErr, selectionStatusDeleteRes) {
								// Handle Selection status error error
								if (selectionStatusDeleteErr) done(selectionStatusDeleteErr);

								// Set assertions
								(selectionStatusDeleteRes.body._id).should.equal(selectionStatusSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Selection status instance if not signed in', function(done) {
		// Set Selection status user 
		selectionStatus.user = user;

		// Create new Selection status model instance
		var selectionStatusObj = new SelectionStatus(selectionStatus);

		// Save the Selection status
		selectionStatusObj.save(function() {
			// Try deleting Selection status
			request(app).delete('/selection-statuses/' + selectionStatusObj._id)
			.expect(401)
			.end(function(selectionStatusDeleteErr, selectionStatusDeleteRes) {
				// Set message assertion
				(selectionStatusDeleteRes.body.message).should.match('User is not logged in');

				// Handle Selection status error error
				done(selectionStatusDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		SelectionStatus.remove().exec();
		done();
	});
});