'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleProjectRole = mongoose.model('PeopleProjectRole'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleProjectRole;

/**
 * People project role routes tests
 */
describe('People project role CRUD tests', function() {
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

		// Save a user to the test db and create new People project role
		user.save(function() {
			peopleProjectRole = {
				name: 'People project role Name'
			};

			done();
		});
	});

	it('should be able to save People project role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project role
				agent.post('/people-project-roles')
					.send(peopleProjectRole)
					.expect(200)
					.end(function(peopleProjectRoleSaveErr, peopleProjectRoleSaveRes) {
						// Handle People project role save error
						if (peopleProjectRoleSaveErr) done(peopleProjectRoleSaveErr);

						// Get a list of People project roles
						agent.get('/people-project-roles')
							.end(function(peopleProjectRolesGetErr, peopleProjectRolesGetRes) {
								// Handle People project role save error
								if (peopleProjectRolesGetErr) done(peopleProjectRolesGetErr);

								// Get People project roles list
								var peopleProjectRoles = peopleProjectRolesGetRes.body;

								// Set assertions
								(peopleProjectRoles[0].user._id).should.equal(userId);
								(peopleProjectRoles[0].name).should.match('People project role Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People project role instance if not logged in', function(done) {
		agent.post('/people-project-roles')
			.send(peopleProjectRole)
			.expect(401)
			.end(function(peopleProjectRoleSaveErr, peopleProjectRoleSaveRes) {
				// Call the assertion callback
				done(peopleProjectRoleSaveErr);
			});
	});

	it('should not be able to save People project role instance if no name is provided', function(done) {
		// Invalidate name field
		peopleProjectRole.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project role
				agent.post('/people-project-roles')
					.send(peopleProjectRole)
					.expect(400)
					.end(function(peopleProjectRoleSaveErr, peopleProjectRoleSaveRes) {
						// Set message assertion
						(peopleProjectRoleSaveRes.body.message).should.match('Please fill People project role name');
						
						// Handle People project role save error
						done(peopleProjectRoleSaveErr);
					});
			});
	});

	it('should be able to update People project role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project role
				agent.post('/people-project-roles')
					.send(peopleProjectRole)
					.expect(200)
					.end(function(peopleProjectRoleSaveErr, peopleProjectRoleSaveRes) {
						// Handle People project role save error
						if (peopleProjectRoleSaveErr) done(peopleProjectRoleSaveErr);

						// Update People project role name
						peopleProjectRole.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People project role
						agent.put('/people-project-roles/' + peopleProjectRoleSaveRes.body._id)
							.send(peopleProjectRole)
							.expect(200)
							.end(function(peopleProjectRoleUpdateErr, peopleProjectRoleUpdateRes) {
								// Handle People project role update error
								if (peopleProjectRoleUpdateErr) done(peopleProjectRoleUpdateErr);

								// Set assertions
								(peopleProjectRoleUpdateRes.body._id).should.equal(peopleProjectRoleSaveRes.body._id);
								(peopleProjectRoleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People project roles if not signed in', function(done) {
		// Create new People project role model instance
		var peopleProjectRoleObj = new PeopleProjectRole(peopleProjectRole);

		// Save the People project role
		peopleProjectRoleObj.save(function() {
			// Request People project roles
			request(app).get('/people-project-roles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People project role if not signed in', function(done) {
		// Create new People project role model instance
		var peopleProjectRoleObj = new PeopleProjectRole(peopleProjectRole);

		// Save the People project role
		peopleProjectRoleObj.save(function() {
			request(app).get('/people-project-roles/' + peopleProjectRoleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleProjectRole.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People project role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People project role
				agent.post('/people-project-roles')
					.send(peopleProjectRole)
					.expect(200)
					.end(function(peopleProjectRoleSaveErr, peopleProjectRoleSaveRes) {
						// Handle People project role save error
						if (peopleProjectRoleSaveErr) done(peopleProjectRoleSaveErr);

						// Delete existing People project role
						agent.delete('/people-project-roles/' + peopleProjectRoleSaveRes.body._id)
							.send(peopleProjectRole)
							.expect(200)
							.end(function(peopleProjectRoleDeleteErr, peopleProjectRoleDeleteRes) {
								// Handle People project role error error
								if (peopleProjectRoleDeleteErr) done(peopleProjectRoleDeleteErr);

								// Set assertions
								(peopleProjectRoleDeleteRes.body._id).should.equal(peopleProjectRoleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People project role instance if not signed in', function(done) {
		// Set People project role user 
		peopleProjectRole.user = user;

		// Create new People project role model instance
		var peopleProjectRoleObj = new PeopleProjectRole(peopleProjectRole);

		// Save the People project role
		peopleProjectRoleObj.save(function() {
			// Try deleting People project role
			request(app).delete('/people-project-roles/' + peopleProjectRoleObj._id)
			.expect(401)
			.end(function(peopleProjectRoleDeleteErr, peopleProjectRoleDeleteRes) {
				// Set message assertion
				(peopleProjectRoleDeleteRes.body.message).should.match('User is not logged in');

				// Handle People project role error error
				done(peopleProjectRoleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleProjectRole.remove().exec();
		done();
	});
});