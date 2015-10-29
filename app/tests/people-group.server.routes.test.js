'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleGroup = mongoose.model('PeopleGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleGroup;

/**
 * People group routes tests
 */
describe('People group CRUD tests', function() {
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

		// Save a user to the test db and create new People group
		user.save(function() {
			peopleGroup = {
				name: 'People group Name'
			};

			done();
		});
	});

	it('should be able to save People group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People group
				agent.post('/people-groups')
					.send(peopleGroup)
					.expect(200)
					.end(function(peopleGroupSaveErr, peopleGroupSaveRes) {
						// Handle People group save error
						if (peopleGroupSaveErr) done(peopleGroupSaveErr);

						// Get a list of People groups
						agent.get('/people-groups')
							.end(function(peopleGroupsGetErr, peopleGroupsGetRes) {
								// Handle People group save error
								if (peopleGroupsGetErr) done(peopleGroupsGetErr);

								// Get People groups list
								var peopleGroups = peopleGroupsGetRes.body;

								// Set assertions
								(peopleGroups[0].user._id).should.equal(userId);
								(peopleGroups[0].name).should.match('People group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People group instance if not logged in', function(done) {
		agent.post('/people-groups')
			.send(peopleGroup)
			.expect(401)
			.end(function(peopleGroupSaveErr, peopleGroupSaveRes) {
				// Call the assertion callback
				done(peopleGroupSaveErr);
			});
	});

	it('should not be able to save People group instance if no name is provided', function(done) {
		// Invalidate name field
		peopleGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People group
				agent.post('/people-groups')
					.send(peopleGroup)
					.expect(400)
					.end(function(peopleGroupSaveErr, peopleGroupSaveRes) {
						// Set message assertion
						(peopleGroupSaveRes.body.message).should.match('Please fill People group name');
						
						// Handle People group save error
						done(peopleGroupSaveErr);
					});
			});
	});

	it('should be able to update People group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People group
				agent.post('/people-groups')
					.send(peopleGroup)
					.expect(200)
					.end(function(peopleGroupSaveErr, peopleGroupSaveRes) {
						// Handle People group save error
						if (peopleGroupSaveErr) done(peopleGroupSaveErr);

						// Update People group name
						peopleGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People group
						agent.put('/people-groups/' + peopleGroupSaveRes.body._id)
							.send(peopleGroup)
							.expect(200)
							.end(function(peopleGroupUpdateErr, peopleGroupUpdateRes) {
								// Handle People group update error
								if (peopleGroupUpdateErr) done(peopleGroupUpdateErr);

								// Set assertions
								(peopleGroupUpdateRes.body._id).should.equal(peopleGroupSaveRes.body._id);
								(peopleGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People groups if not signed in', function(done) {
		// Create new People group model instance
		var peopleGroupObj = new PeopleGroup(peopleGroup);

		// Save the People group
		peopleGroupObj.save(function() {
			// Request People groups
			request(app).get('/people-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People group if not signed in', function(done) {
		// Create new People group model instance
		var peopleGroupObj = new PeopleGroup(peopleGroup);

		// Save the People group
		peopleGroupObj.save(function() {
			request(app).get('/people-groups/' + peopleGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People group
				agent.post('/people-groups')
					.send(peopleGroup)
					.expect(200)
					.end(function(peopleGroupSaveErr, peopleGroupSaveRes) {
						// Handle People group save error
						if (peopleGroupSaveErr) done(peopleGroupSaveErr);

						// Delete existing People group
						agent.delete('/people-groups/' + peopleGroupSaveRes.body._id)
							.send(peopleGroup)
							.expect(200)
							.end(function(peopleGroupDeleteErr, peopleGroupDeleteRes) {
								// Handle People group error error
								if (peopleGroupDeleteErr) done(peopleGroupDeleteErr);

								// Set assertions
								(peopleGroupDeleteRes.body._id).should.equal(peopleGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People group instance if not signed in', function(done) {
		// Set People group user 
		peopleGroup.user = user;

		// Create new People group model instance
		var peopleGroupObj = new PeopleGroup(peopleGroup);

		// Save the People group
		peopleGroupObj.save(function() {
			// Try deleting People group
			request(app).delete('/people-groups/' + peopleGroupObj._id)
			.expect(401)
			.end(function(peopleGroupDeleteErr, peopleGroupDeleteRes) {
				// Set message assertion
				(peopleGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle People group error error
				done(peopleGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleGroup.remove().exec();
		done();
	});
});