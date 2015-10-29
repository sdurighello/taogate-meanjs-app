'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleRole = mongoose.model('PeopleRole'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleRole;

/**
 * People role routes tests
 */
describe('People role CRUD tests', function() {
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

		// Save a user to the test db and create new People role
		user.save(function() {
			peopleRole = {
				name: 'People role Name'
			};

			done();
		});
	});

	it('should be able to save People role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People role
				agent.post('/people-roles')
					.send(peopleRole)
					.expect(200)
					.end(function(peopleRoleSaveErr, peopleRoleSaveRes) {
						// Handle People role save error
						if (peopleRoleSaveErr) done(peopleRoleSaveErr);

						// Get a list of People roles
						agent.get('/people-roles')
							.end(function(peopleRolesGetErr, peopleRolesGetRes) {
								// Handle People role save error
								if (peopleRolesGetErr) done(peopleRolesGetErr);

								// Get People roles list
								var peopleRoles = peopleRolesGetRes.body;

								// Set assertions
								(peopleRoles[0].user._id).should.equal(userId);
								(peopleRoles[0].name).should.match('People role Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People role instance if not logged in', function(done) {
		agent.post('/people-roles')
			.send(peopleRole)
			.expect(401)
			.end(function(peopleRoleSaveErr, peopleRoleSaveRes) {
				// Call the assertion callback
				done(peopleRoleSaveErr);
			});
	});

	it('should not be able to save People role instance if no name is provided', function(done) {
		// Invalidate name field
		peopleRole.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People role
				agent.post('/people-roles')
					.send(peopleRole)
					.expect(400)
					.end(function(peopleRoleSaveErr, peopleRoleSaveRes) {
						// Set message assertion
						(peopleRoleSaveRes.body.message).should.match('Please fill People role name');
						
						// Handle People role save error
						done(peopleRoleSaveErr);
					});
			});
	});

	it('should be able to update People role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People role
				agent.post('/people-roles')
					.send(peopleRole)
					.expect(200)
					.end(function(peopleRoleSaveErr, peopleRoleSaveRes) {
						// Handle People role save error
						if (peopleRoleSaveErr) done(peopleRoleSaveErr);

						// Update People role name
						peopleRole.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People role
						agent.put('/people-roles/' + peopleRoleSaveRes.body._id)
							.send(peopleRole)
							.expect(200)
							.end(function(peopleRoleUpdateErr, peopleRoleUpdateRes) {
								// Handle People role update error
								if (peopleRoleUpdateErr) done(peopleRoleUpdateErr);

								// Set assertions
								(peopleRoleUpdateRes.body._id).should.equal(peopleRoleSaveRes.body._id);
								(peopleRoleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People roles if not signed in', function(done) {
		// Create new People role model instance
		var peopleRoleObj = new PeopleRole(peopleRole);

		// Save the People role
		peopleRoleObj.save(function() {
			// Request People roles
			request(app).get('/people-roles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People role if not signed in', function(done) {
		// Create new People role model instance
		var peopleRoleObj = new PeopleRole(peopleRole);

		// Save the People role
		peopleRoleObj.save(function() {
			request(app).get('/people-roles/' + peopleRoleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleRole.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People role
				agent.post('/people-roles')
					.send(peopleRole)
					.expect(200)
					.end(function(peopleRoleSaveErr, peopleRoleSaveRes) {
						// Handle People role save error
						if (peopleRoleSaveErr) done(peopleRoleSaveErr);

						// Delete existing People role
						agent.delete('/people-roles/' + peopleRoleSaveRes.body._id)
							.send(peopleRole)
							.expect(200)
							.end(function(peopleRoleDeleteErr, peopleRoleDeleteRes) {
								// Handle People role error error
								if (peopleRoleDeleteErr) done(peopleRoleDeleteErr);

								// Set assertions
								(peopleRoleDeleteRes.body._id).should.equal(peopleRoleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People role instance if not signed in', function(done) {
		// Set People role user 
		peopleRole.user = user;

		// Create new People role model instance
		var peopleRoleObj = new PeopleRole(peopleRole);

		// Save the People role
		peopleRoleObj.save(function() {
			// Try deleting People role
			request(app).delete('/people-roles/' + peopleRoleObj._id)
			.expect(401)
			.end(function(peopleRoleDeleteErr, peopleRoleDeleteRes) {
				// Set message assertion
				(peopleRoleDeleteRes.body.message).should.match('User is not logged in');

				// Handle People role error error
				done(peopleRoleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleRole.remove().exec();
		done();
	});
});