'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChangeRequestPriority = mongoose.model('ChangeRequestPriority'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, changeRequestPriority;

/**
 * Change request priority routes tests
 */
describe('Change request priority CRUD tests', function() {
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

		// Save a user to the test db and create new Change request priority
		user.save(function() {
			changeRequestPriority = {
				name: 'Change request priority Name'
			};

			done();
		});
	});

	it('should be able to save Change request priority instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request priority
				agent.post('/change-request-priorities')
					.send(changeRequestPriority)
					.expect(200)
					.end(function(changeRequestPrioritySaveErr, changeRequestPrioritySaveRes) {
						// Handle Change request priority save error
						if (changeRequestPrioritySaveErr) done(changeRequestPrioritySaveErr);

						// Get a list of Change request priorities
						agent.get('/change-request-priorities')
							.end(function(changeRequestPrioritiesGetErr, changeRequestPrioritiesGetRes) {
								// Handle Change request priority save error
								if (changeRequestPrioritiesGetErr) done(changeRequestPrioritiesGetErr);

								// Get Change request priorities list
								var changeRequestPriorities = changeRequestPrioritiesGetRes.body;

								// Set assertions
								(changeRequestPriorities[0].user._id).should.equal(userId);
								(changeRequestPriorities[0].name).should.match('Change request priority Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Change request priority instance if not logged in', function(done) {
		agent.post('/change-request-priorities')
			.send(changeRequestPriority)
			.expect(401)
			.end(function(changeRequestPrioritySaveErr, changeRequestPrioritySaveRes) {
				// Call the assertion callback
				done(changeRequestPrioritySaveErr);
			});
	});

	it('should not be able to save Change request priority instance if no name is provided', function(done) {
		// Invalidate name field
		changeRequestPriority.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request priority
				agent.post('/change-request-priorities')
					.send(changeRequestPriority)
					.expect(400)
					.end(function(changeRequestPrioritySaveErr, changeRequestPrioritySaveRes) {
						// Set message assertion
						(changeRequestPrioritySaveRes.body.message).should.match('Please fill Change request priority name');
						
						// Handle Change request priority save error
						done(changeRequestPrioritySaveErr);
					});
			});
	});

	it('should be able to update Change request priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request priority
				agent.post('/change-request-priorities')
					.send(changeRequestPriority)
					.expect(200)
					.end(function(changeRequestPrioritySaveErr, changeRequestPrioritySaveRes) {
						// Handle Change request priority save error
						if (changeRequestPrioritySaveErr) done(changeRequestPrioritySaveErr);

						// Update Change request priority name
						changeRequestPriority.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Change request priority
						agent.put('/change-request-priorities/' + changeRequestPrioritySaveRes.body._id)
							.send(changeRequestPriority)
							.expect(200)
							.end(function(changeRequestPriorityUpdateErr, changeRequestPriorityUpdateRes) {
								// Handle Change request priority update error
								if (changeRequestPriorityUpdateErr) done(changeRequestPriorityUpdateErr);

								// Set assertions
								(changeRequestPriorityUpdateRes.body._id).should.equal(changeRequestPrioritySaveRes.body._id);
								(changeRequestPriorityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Change request priorities if not signed in', function(done) {
		// Create new Change request priority model instance
		var changeRequestPriorityObj = new ChangeRequestPriority(changeRequestPriority);

		// Save the Change request priority
		changeRequestPriorityObj.save(function() {
			// Request Change request priorities
			request(app).get('/change-request-priorities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Change request priority if not signed in', function(done) {
		// Create new Change request priority model instance
		var changeRequestPriorityObj = new ChangeRequestPriority(changeRequestPriority);

		// Save the Change request priority
		changeRequestPriorityObj.save(function() {
			request(app).get('/change-request-priorities/' + changeRequestPriorityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', changeRequestPriority.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Change request priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request priority
				agent.post('/change-request-priorities')
					.send(changeRequestPriority)
					.expect(200)
					.end(function(changeRequestPrioritySaveErr, changeRequestPrioritySaveRes) {
						// Handle Change request priority save error
						if (changeRequestPrioritySaveErr) done(changeRequestPrioritySaveErr);

						// Delete existing Change request priority
						agent.delete('/change-request-priorities/' + changeRequestPrioritySaveRes.body._id)
							.send(changeRequestPriority)
							.expect(200)
							.end(function(changeRequestPriorityDeleteErr, changeRequestPriorityDeleteRes) {
								// Handle Change request priority error error
								if (changeRequestPriorityDeleteErr) done(changeRequestPriorityDeleteErr);

								// Set assertions
								(changeRequestPriorityDeleteRes.body._id).should.equal(changeRequestPrioritySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Change request priority instance if not signed in', function(done) {
		// Set Change request priority user 
		changeRequestPriority.user = user;

		// Create new Change request priority model instance
		var changeRequestPriorityObj = new ChangeRequestPriority(changeRequestPriority);

		// Save the Change request priority
		changeRequestPriorityObj.save(function() {
			// Try deleting Change request priority
			request(app).delete('/change-request-priorities/' + changeRequestPriorityObj._id)
			.expect(401)
			.end(function(changeRequestPriorityDeleteErr, changeRequestPriorityDeleteRes) {
				// Set message assertion
				(changeRequestPriorityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Change request priority error error
				done(changeRequestPriorityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ChangeRequestPriority.remove().exec();
		done();
	});
});