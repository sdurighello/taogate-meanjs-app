'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PriorityGroup = mongoose.model('PriorityGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, priorityGroup;

/**
 * Priority group routes tests
 */
describe('Priority group CRUD tests', function() {
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

		// Save a user to the test db and create new Priority group
		user.save(function() {
			priorityGroup = {
				name: 'Priority group Name'
			};

			done();
		});
	});

	it('should be able to save Priority group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority group
				agent.post('/priority-groups')
					.send(priorityGroup)
					.expect(200)
					.end(function(priorityGroupSaveErr, priorityGroupSaveRes) {
						// Handle Priority group save error
						if (priorityGroupSaveErr) done(priorityGroupSaveErr);

						// Get a list of Priority groups
						agent.get('/priority-groups')
							.end(function(priorityGroupsGetErr, priorityGroupsGetRes) {
								// Handle Priority group save error
								if (priorityGroupsGetErr) done(priorityGroupsGetErr);

								// Get Priority groups list
								var priorityGroups = priorityGroupsGetRes.body;

								// Set assertions
								(priorityGroups[0].user._id).should.equal(userId);
								(priorityGroups[0].name).should.match('Priority group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Priority group instance if not logged in', function(done) {
		agent.post('/priority-groups')
			.send(priorityGroup)
			.expect(401)
			.end(function(priorityGroupSaveErr, priorityGroupSaveRes) {
				// Call the assertion callback
				done(priorityGroupSaveErr);
			});
	});

	it('should not be able to save Priority group instance if no name is provided', function(done) {
		// Invalidate name field
		priorityGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority group
				agent.post('/priority-groups')
					.send(priorityGroup)
					.expect(400)
					.end(function(priorityGroupSaveErr, priorityGroupSaveRes) {
						// Set message assertion
						(priorityGroupSaveRes.body.message).should.match('Please fill Priority group name');
						
						// Handle Priority group save error
						done(priorityGroupSaveErr);
					});
			});
	});

	it('should be able to update Priority group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority group
				agent.post('/priority-groups')
					.send(priorityGroup)
					.expect(200)
					.end(function(priorityGroupSaveErr, priorityGroupSaveRes) {
						// Handle Priority group save error
						if (priorityGroupSaveErr) done(priorityGroupSaveErr);

						// Update Priority group name
						priorityGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Priority group
						agent.put('/priority-groups/' + priorityGroupSaveRes.body._id)
							.send(priorityGroup)
							.expect(200)
							.end(function(priorityGroupUpdateErr, priorityGroupUpdateRes) {
								// Handle Priority group update error
								if (priorityGroupUpdateErr) done(priorityGroupUpdateErr);

								// Set assertions
								(priorityGroupUpdateRes.body._id).should.equal(priorityGroupSaveRes.body._id);
								(priorityGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Priority groups if not signed in', function(done) {
		// Create new Priority group model instance
		var priorityGroupObj = new PriorityGroup(priorityGroup);

		// Save the Priority group
		priorityGroupObj.save(function() {
			// Request Priority groups
			request(app).get('/priority-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Priority group if not signed in', function(done) {
		// Create new Priority group model instance
		var priorityGroupObj = new PriorityGroup(priorityGroup);

		// Save the Priority group
		priorityGroupObj.save(function() {
			request(app).get('/priority-groups/' + priorityGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', priorityGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Priority group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority group
				agent.post('/priority-groups')
					.send(priorityGroup)
					.expect(200)
					.end(function(priorityGroupSaveErr, priorityGroupSaveRes) {
						// Handle Priority group save error
						if (priorityGroupSaveErr) done(priorityGroupSaveErr);

						// Delete existing Priority group
						agent.delete('/priority-groups/' + priorityGroupSaveRes.body._id)
							.send(priorityGroup)
							.expect(200)
							.end(function(priorityGroupDeleteErr, priorityGroupDeleteRes) {
								// Handle Priority group error error
								if (priorityGroupDeleteErr) done(priorityGroupDeleteErr);

								// Set assertions
								(priorityGroupDeleteRes.body._id).should.equal(priorityGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Priority group instance if not signed in', function(done) {
		// Set Priority group user 
		priorityGroup.user = user;

		// Create new Priority group model instance
		var priorityGroupObj = new PriorityGroup(priorityGroup);

		// Save the Priority group
		priorityGroupObj.save(function() {
			// Try deleting Priority group
			request(app).delete('/priority-groups/' + priorityGroupObj._id)
			.expect(401)
			.end(function(priorityGroupDeleteErr, priorityGroupDeleteRes) {
				// Set message assertion
				(priorityGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Priority group error error
				done(priorityGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PriorityGroup.remove().exec();
		done();
	});
});