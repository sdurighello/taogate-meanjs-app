'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleOrganizationalGroup = mongoose.model('PeopleOrganizationalGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleOrganizationalGroup;

/**
 * People organizational group routes tests
 */
describe('People organizational group CRUD tests', function() {
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

		// Save a user to the test db and create new People organizational group
		user.save(function() {
			peopleOrganizationalGroup = {
				name: 'People organizational group Name'
			};

			done();
		});
	});

	it('should be able to save People organizational group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People organizational group
				agent.post('/people-organizational-groups')
					.send(peopleOrganizationalGroup)
					.expect(200)
					.end(function(peopleOrganizationalGroupSaveErr, peopleOrganizationalGroupSaveRes) {
						// Handle People organizational group save error
						if (peopleOrganizationalGroupSaveErr) done(peopleOrganizationalGroupSaveErr);

						// Get a list of People organizational groups
						agent.get('/people-organizational-groups')
							.end(function(peopleOrganizationalGroupsGetErr, peopleOrganizationalGroupsGetRes) {
								// Handle People organizational group save error
								if (peopleOrganizationalGroupsGetErr) done(peopleOrganizationalGroupsGetErr);

								// Get People organizational groups list
								var peopleOrganizationalGroups = peopleOrganizationalGroupsGetRes.body;

								// Set assertions
								(peopleOrganizationalGroups[0].user._id).should.equal(userId);
								(peopleOrganizationalGroups[0].name).should.match('People organizational group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People organizational group instance if not logged in', function(done) {
		agent.post('/people-organizational-groups')
			.send(peopleOrganizationalGroup)
			.expect(401)
			.end(function(peopleOrganizationalGroupSaveErr, peopleOrganizationalGroupSaveRes) {
				// Call the assertion callback
				done(peopleOrganizationalGroupSaveErr);
			});
	});

	it('should not be able to save People organizational group instance if no name is provided', function(done) {
		// Invalidate name field
		peopleOrganizationalGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People organizational group
				agent.post('/people-organizational-groups')
					.send(peopleOrganizationalGroup)
					.expect(400)
					.end(function(peopleOrganizationalGroupSaveErr, peopleOrganizationalGroupSaveRes) {
						// Set message assertion
						(peopleOrganizationalGroupSaveRes.body.message).should.match('Please fill People organizational group name');
						
						// Handle People organizational group save error
						done(peopleOrganizationalGroupSaveErr);
					});
			});
	});

	it('should be able to update People organizational group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People organizational group
				agent.post('/people-organizational-groups')
					.send(peopleOrganizationalGroup)
					.expect(200)
					.end(function(peopleOrganizationalGroupSaveErr, peopleOrganizationalGroupSaveRes) {
						// Handle People organizational group save error
						if (peopleOrganizationalGroupSaveErr) done(peopleOrganizationalGroupSaveErr);

						// Update People organizational group name
						peopleOrganizationalGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People organizational group
						agent.put('/people-organizational-groups/' + peopleOrganizationalGroupSaveRes.body._id)
							.send(peopleOrganizationalGroup)
							.expect(200)
							.end(function(peopleOrganizationalGroupUpdateErr, peopleOrganizationalGroupUpdateRes) {
								// Handle People organizational group update error
								if (peopleOrganizationalGroupUpdateErr) done(peopleOrganizationalGroupUpdateErr);

								// Set assertions
								(peopleOrganizationalGroupUpdateRes.body._id).should.equal(peopleOrganizationalGroupSaveRes.body._id);
								(peopleOrganizationalGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People organizational groups if not signed in', function(done) {
		// Create new People organizational group model instance
		var peopleOrganizationalGroupObj = new PeopleOrganizationalGroup(peopleOrganizationalGroup);

		// Save the People organizational group
		peopleOrganizationalGroupObj.save(function() {
			// Request People organizational groups
			request(app).get('/people-organizational-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People organizational group if not signed in', function(done) {
		// Create new People organizational group model instance
		var peopleOrganizationalGroupObj = new PeopleOrganizationalGroup(peopleOrganizationalGroup);

		// Save the People organizational group
		peopleOrganizationalGroupObj.save(function() {
			request(app).get('/people-organizational-groups/' + peopleOrganizationalGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleOrganizationalGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People organizational group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People organizational group
				agent.post('/people-organizational-groups')
					.send(peopleOrganizationalGroup)
					.expect(200)
					.end(function(peopleOrganizationalGroupSaveErr, peopleOrganizationalGroupSaveRes) {
						// Handle People organizational group save error
						if (peopleOrganizationalGroupSaveErr) done(peopleOrganizationalGroupSaveErr);

						// Delete existing People organizational group
						agent.delete('/people-organizational-groups/' + peopleOrganizationalGroupSaveRes.body._id)
							.send(peopleOrganizationalGroup)
							.expect(200)
							.end(function(peopleOrganizationalGroupDeleteErr, peopleOrganizationalGroupDeleteRes) {
								// Handle People organizational group error error
								if (peopleOrganizationalGroupDeleteErr) done(peopleOrganizationalGroupDeleteErr);

								// Set assertions
								(peopleOrganizationalGroupDeleteRes.body._id).should.equal(peopleOrganizationalGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People organizational group instance if not signed in', function(done) {
		// Set People organizational group user 
		peopleOrganizationalGroup.user = user;

		// Create new People organizational group model instance
		var peopleOrganizationalGroupObj = new PeopleOrganizationalGroup(peopleOrganizationalGroup);

		// Save the People organizational group
		peopleOrganizationalGroupObj.save(function() {
			// Try deleting People organizational group
			request(app).delete('/people-organizational-groups/' + peopleOrganizationalGroupObj._id)
			.expect(401)
			.end(function(peopleOrganizationalGroupDeleteErr, peopleOrganizationalGroupDeleteRes) {
				// Set message assertion
				(peopleOrganizationalGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle People organizational group error error
				done(peopleOrganizationalGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleOrganizationalGroup.remove().exec();
		done();
	});
});