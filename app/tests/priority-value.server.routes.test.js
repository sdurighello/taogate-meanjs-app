'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PriorityValue = mongoose.model('PriorityValue'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, priorityValue;

/**
 * Priority value routes tests
 */
describe('Priority value CRUD tests', function() {
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

		// Save a user to the test db and create new Priority value
		user.save(function() {
			priorityValue = {
				name: 'Priority value Name'
			};

			done();
		});
	});

	it('should be able to save Priority value instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority value
				agent.post('/priority-values')
					.send(priorityValue)
					.expect(200)
					.end(function(priorityValueSaveErr, priorityValueSaveRes) {
						// Handle Priority value save error
						if (priorityValueSaveErr) done(priorityValueSaveErr);

						// Get a list of Priority values
						agent.get('/priority-values')
							.end(function(priorityValuesGetErr, priorityValuesGetRes) {
								// Handle Priority value save error
								if (priorityValuesGetErr) done(priorityValuesGetErr);

								// Get Priority values list
								var priorityValues = priorityValuesGetRes.body;

								// Set assertions
								(priorityValues[0].user._id).should.equal(userId);
								(priorityValues[0].name).should.match('Priority value Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Priority value instance if not logged in', function(done) {
		agent.post('/priority-values')
			.send(priorityValue)
			.expect(401)
			.end(function(priorityValueSaveErr, priorityValueSaveRes) {
				// Call the assertion callback
				done(priorityValueSaveErr);
			});
	});

	it('should not be able to save Priority value instance if no name is provided', function(done) {
		// Invalidate name field
		priorityValue.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority value
				agent.post('/priority-values')
					.send(priorityValue)
					.expect(400)
					.end(function(priorityValueSaveErr, priorityValueSaveRes) {
						// Set message assertion
						(priorityValueSaveRes.body.message).should.match('Please fill Priority value name');
						
						// Handle Priority value save error
						done(priorityValueSaveErr);
					});
			});
	});

	it('should be able to update Priority value instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority value
				agent.post('/priority-values')
					.send(priorityValue)
					.expect(200)
					.end(function(priorityValueSaveErr, priorityValueSaveRes) {
						// Handle Priority value save error
						if (priorityValueSaveErr) done(priorityValueSaveErr);

						// Update Priority value name
						priorityValue.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Priority value
						agent.put('/priority-values/' + priorityValueSaveRes.body._id)
							.send(priorityValue)
							.expect(200)
							.end(function(priorityValueUpdateErr, priorityValueUpdateRes) {
								// Handle Priority value update error
								if (priorityValueUpdateErr) done(priorityValueUpdateErr);

								// Set assertions
								(priorityValueUpdateRes.body._id).should.equal(priorityValueSaveRes.body._id);
								(priorityValueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Priority values if not signed in', function(done) {
		// Create new Priority value model instance
		var priorityValueObj = new PriorityValue(priorityValue);

		// Save the Priority value
		priorityValueObj.save(function() {
			// Request Priority values
			request(app).get('/priority-values')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Priority value if not signed in', function(done) {
		// Create new Priority value model instance
		var priorityValueObj = new PriorityValue(priorityValue);

		// Save the Priority value
		priorityValueObj.save(function() {
			request(app).get('/priority-values/' + priorityValueObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', priorityValue.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Priority value instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority value
				agent.post('/priority-values')
					.send(priorityValue)
					.expect(200)
					.end(function(priorityValueSaveErr, priorityValueSaveRes) {
						// Handle Priority value save error
						if (priorityValueSaveErr) done(priorityValueSaveErr);

						// Delete existing Priority value
						agent.delete('/priority-values/' + priorityValueSaveRes.body._id)
							.send(priorityValue)
							.expect(200)
							.end(function(priorityValueDeleteErr, priorityValueDeleteRes) {
								// Handle Priority value error error
								if (priorityValueDeleteErr) done(priorityValueDeleteErr);

								// Set assertions
								(priorityValueDeleteRes.body._id).should.equal(priorityValueSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Priority value instance if not signed in', function(done) {
		// Set Priority value user 
		priorityValue.user = user;

		// Create new Priority value model instance
		var priorityValueObj = new PriorityValue(priorityValue);

		// Save the Priority value
		priorityValueObj.save(function() {
			// Try deleting Priority value
			request(app).delete('/priority-values/' + priorityValueObj._id)
			.expect(401)
			.end(function(priorityValueDeleteErr, priorityValueDeleteRes) {
				// Set message assertion
				(priorityValueDeleteRes.body.message).should.match('User is not logged in');

				// Handle Priority value error error
				done(priorityValueDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PriorityValue.remove().exec();
		done();
	});
});