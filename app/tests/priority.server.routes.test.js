'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Priority = mongoose.model('Priority'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, priority;

/**
 * Priority routes tests
 */
describe('Priority CRUD tests', function() {
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

		// Save a user to the test db and create new Priority
		user.save(function() {
			priority = {
				name: 'Priority Name'
			};

			done();
		});
	});

	it('should be able to save Priority instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority
				agent.post('/priorities')
					.send(priority)
					.expect(200)
					.end(function(prioritySaveErr, prioritySaveRes) {
						// Handle Priority save error
						if (prioritySaveErr) done(prioritySaveErr);

						// Get a list of Priorities
						agent.get('/priorities')
							.end(function(prioritiesGetErr, prioritiesGetRes) {
								// Handle Priority save error
								if (prioritiesGetErr) done(prioritiesGetErr);

								// Get Priorities list
								var priorities = prioritiesGetRes.body;

								// Set assertions
								(priorities[0].user._id).should.equal(userId);
								(priorities[0].name).should.match('Priority Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Priority instance if not logged in', function(done) {
		agent.post('/priorities')
			.send(priority)
			.expect(401)
			.end(function(prioritySaveErr, prioritySaveRes) {
				// Call the assertion callback
				done(prioritySaveErr);
			});
	});

	it('should not be able to save Priority instance if no name is provided', function(done) {
		// Invalidate name field
		priority.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority
				agent.post('/priorities')
					.send(priority)
					.expect(400)
					.end(function(prioritySaveErr, prioritySaveRes) {
						// Set message assertion
						(prioritySaveRes.body.message).should.match('Please fill Priority name');
						
						// Handle Priority save error
						done(prioritySaveErr);
					});
			});
	});

	it('should be able to update Priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority
				agent.post('/priorities')
					.send(priority)
					.expect(200)
					.end(function(prioritySaveErr, prioritySaveRes) {
						// Handle Priority save error
						if (prioritySaveErr) done(prioritySaveErr);

						// Update Priority name
						priority.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Priority
						agent.put('/priorities/' + prioritySaveRes.body._id)
							.send(priority)
							.expect(200)
							.end(function(priorityUpdateErr, priorityUpdateRes) {
								// Handle Priority update error
								if (priorityUpdateErr) done(priorityUpdateErr);

								// Set assertions
								(priorityUpdateRes.body._id).should.equal(prioritySaveRes.body._id);
								(priorityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Priorities if not signed in', function(done) {
		// Create new Priority model instance
		var priorityObj = new Priority(priority);

		// Save the Priority
		priorityObj.save(function() {
			// Request Priorities
			request(app).get('/priorities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Priority if not signed in', function(done) {
		// Create new Priority model instance
		var priorityObj = new Priority(priority);

		// Save the Priority
		priorityObj.save(function() {
			request(app).get('/priorities/' + priorityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', priority.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority
				agent.post('/priorities')
					.send(priority)
					.expect(200)
					.end(function(prioritySaveErr, prioritySaveRes) {
						// Handle Priority save error
						if (prioritySaveErr) done(prioritySaveErr);

						// Delete existing Priority
						agent.delete('/priorities/' + prioritySaveRes.body._id)
							.send(priority)
							.expect(200)
							.end(function(priorityDeleteErr, priorityDeleteRes) {
								// Handle Priority error error
								if (priorityDeleteErr) done(priorityDeleteErr);

								// Set assertions
								(priorityDeleteRes.body._id).should.equal(prioritySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Priority instance if not signed in', function(done) {
		// Set Priority user 
		priority.user = user;

		// Create new Priority model instance
		var priorityObj = new Priority(priority);

		// Save the Priority
		priorityObj.save(function() {
			// Try deleting Priority
			request(app).delete('/priorities/' + priorityObj._id)
			.expect(401)
			.end(function(priorityDeleteErr, priorityDeleteRes) {
				// Set message assertion
				(priorityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Priority error error
				done(priorityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Priority.remove().exec();
		done();
	});
});