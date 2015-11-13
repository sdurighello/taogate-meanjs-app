'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleProjectGroup = mongoose.model('PeopleProjectGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleProjectGroup;

/**
 * People project group routes tests
 */
describe('People project group CRUD tests', function() {
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

		// Save a user to the test db and create new People project group
		user.save(function() {
			peopleProjectGroup = {
				name: 'People project group Name'
			};

			done();
		});
	});

	it('should be able to save People project group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project group
				agent.post('/people-project-groups')
					.send(peopleProjectGroup)
					.expect(200)
					.end(function(peopleProjectGroupSaveErr, peopleProjectGroupSaveRes) {
						// Handle People project group save error
						if (peopleProjectGroupSaveErr) done(peopleProjectGroupSaveErr);

						// Get a list of People project groups
						agent.get('/people-project-groups')
							.end(function(peopleProjectGroupsGetErr, peopleProjectGroupsGetRes) {
								// Handle People project group save error
								if (peopleProjectGroupsGetErr) done(peopleProjectGroupsGetErr);

								// Get People project groups list
								var peopleProjectGroups = peopleProjectGroupsGetRes.body;

								// Set assertions
								(peopleProjectGroups[0].user._id).should.equal(userId);
								(peopleProjectGroups[0].name).should.match('People project group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People project group instance if not logged in', function(done) {
		agent.post('/people-project-groups')
			.send(peopleProjectGroup)
			.expect(401)
			.end(function(peopleProjectGroupSaveErr, peopleProjectGroupSaveRes) {
				// Call the assertion callback
				done(peopleProjectGroupSaveErr);
			});
	});

	it('should not be able to save People project group instance if no name is provided', function(done) {
		// Invalidate name field
		peopleProjectGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project group
				agent.post('/people-project-groups')
					.send(peopleProjectGroup)
					.expect(400)
					.end(function(peopleProjectGroupSaveErr, peopleProjectGroupSaveRes) {
						// Set message assertion
						(peopleProjectGroupSaveRes.body.message).should.match('Please fill People project group name');
						
						// Handle People project group save error
						done(peopleProjectGroupSaveErr);
					});
			});
	});

	it('should be able to update People project group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project group
				agent.post('/people-project-groups')
					.send(peopleProjectGroup)
					.expect(200)
					.end(function(peopleProjectGroupSaveErr, peopleProjectGroupSaveRes) {
						// Handle People project group save error
						if (peopleProjectGroupSaveErr) done(peopleProjectGroupSaveErr);

						// Update People project group name
						peopleProjectGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People project group
						agent.put('/people-project-groups/' + peopleProjectGroupSaveRes.body._id)
							.send(peopleProjectGroup)
							.expect(200)
							.end(function(peopleProjectGroupUpdateErr, peopleProjectGroupUpdateRes) {
								// Handle People project group update error
								if (peopleProjectGroupUpdateErr) done(peopleProjectGroupUpdateErr);

								// Set assertions
								(peopleProjectGroupUpdateRes.body._id).should.equal(peopleProjectGroupSaveRes.body._id);
								(peopleProjectGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People project groups if not signed in', function(done) {
		// Create new People project group model instance
		var peopleProjectGroupObj = new PeopleProjectGroup(peopleProjectGroup);

		// Save the People project group
		peopleProjectGroupObj.save(function() {
			// Request People project groups
			request(app).get('/people-project-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People project group if not signed in', function(done) {
		// Create new People project group model instance
		var peopleProjectGroupObj = new PeopleProjectGroup(peopleProjectGroup);

		// Save the People project group
		peopleProjectGroupObj.save(function() {
			request(app).get('/people-project-groups/' + peopleProjectGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleProjectGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People project group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project group
				agent.post('/people-project-groups')
					.send(peopleProjectGroup)
					.expect(200)
					.end(function(peopleProjectGroupSaveErr, peopleProjectGroupSaveRes) {
						// Handle People project group save error
						if (peopleProjectGroupSaveErr) done(peopleProjectGroupSaveErr);

						// Delete existing People project group
						agent.delete('/people-project-groups/' + peopleProjectGroupSaveRes.body._id)
							.send(peopleProjectGroup)
							.expect(200)
							.end(function(peopleProjectGroupDeleteErr, peopleProjectGroupDeleteRes) {
								// Handle People project group error error
								if (peopleProjectGroupDeleteErr) done(peopleProjectGroupDeleteErr);

								// Set assertions
								(peopleProjectGroupDeleteRes.body._id).should.equal(peopleProjectGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People project group instance if not signed in', function(done) {
		// Set People project group user 
		peopleProjectGroup.user = user;

		// Create new People project group model instance
		var peopleProjectGroupObj = new PeopleProjectGroup(peopleProjectGroup);

		// Save the People project group
		peopleProjectGroupObj.save(function() {
			// Try deleting People project group
			request(app).delete('/people-project-groups/' + peopleProjectGroupObj._id)
			.expect(401)
			.end(function(peopleProjectGroupDeleteErr, peopleProjectGroupDeleteRes) {
				// Set message assertion
				(peopleProjectGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle People project group error error
				done(peopleProjectGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleProjectGroup.remove().exec();
		done();
	});
});