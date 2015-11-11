'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MilestoneType = mongoose.model('MilestoneType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, milestoneType;

/**
 * Milestone type routes tests
 */
describe('Milestone type CRUD tests', function() {
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

		// Save a user to the test db and create new Milestone type
		user.save(function() {
			milestoneType = {
				name: 'Milestone type Name'
			};

			done();
		});
	});

	it('should be able to save Milestone type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone type
				agent.post('/milestone-types')
					.send(milestoneType)
					.expect(200)
					.end(function(milestoneTypeSaveErr, milestoneTypeSaveRes) {
						// Handle Milestone type save error
						if (milestoneTypeSaveErr) done(milestoneTypeSaveErr);

						// Get a list of Milestone types
						agent.get('/milestone-types')
							.end(function(milestoneTypesGetErr, milestoneTypesGetRes) {
								// Handle Milestone type save error
								if (milestoneTypesGetErr) done(milestoneTypesGetErr);

								// Get Milestone types list
								var milestoneTypes = milestoneTypesGetRes.body;

								// Set assertions
								(milestoneTypes[0].user._id).should.equal(userId);
								(milestoneTypes[0].name).should.match('Milestone type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Milestone type instance if not logged in', function(done) {
		agent.post('/milestone-types')
			.send(milestoneType)
			.expect(401)
			.end(function(milestoneTypeSaveErr, milestoneTypeSaveRes) {
				// Call the assertion callback
				done(milestoneTypeSaveErr);
			});
	});

	it('should not be able to save Milestone type instance if no name is provided', function(done) {
		// Invalidate name field
		milestoneType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone type
				agent.post('/milestone-types')
					.send(milestoneType)
					.expect(400)
					.end(function(milestoneTypeSaveErr, milestoneTypeSaveRes) {
						// Set message assertion
						(milestoneTypeSaveRes.body.message).should.match('Please fill Milestone type name');
						
						// Handle Milestone type save error
						done(milestoneTypeSaveErr);
					});
			});
	});

	it('should be able to update Milestone type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone type
				agent.post('/milestone-types')
					.send(milestoneType)
					.expect(200)
					.end(function(milestoneTypeSaveErr, milestoneTypeSaveRes) {
						// Handle Milestone type save error
						if (milestoneTypeSaveErr) done(milestoneTypeSaveErr);

						// Update Milestone type name
						milestoneType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Milestone type
						agent.put('/milestone-types/' + milestoneTypeSaveRes.body._id)
							.send(milestoneType)
							.expect(200)
							.end(function(milestoneTypeUpdateErr, milestoneTypeUpdateRes) {
								// Handle Milestone type update error
								if (milestoneTypeUpdateErr) done(milestoneTypeUpdateErr);

								// Set assertions
								(milestoneTypeUpdateRes.body._id).should.equal(milestoneTypeSaveRes.body._id);
								(milestoneTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Milestone types if not signed in', function(done) {
		// Create new Milestone type model instance
		var milestoneTypeObj = new MilestoneType(milestoneType);

		// Save the Milestone type
		milestoneTypeObj.save(function() {
			// Request Milestone types
			request(app).get('/milestone-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Milestone type if not signed in', function(done) {
		// Create new Milestone type model instance
		var milestoneTypeObj = new MilestoneType(milestoneType);

		// Save the Milestone type
		milestoneTypeObj.save(function() {
			request(app).get('/milestone-types/' + milestoneTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', milestoneType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Milestone type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone type
				agent.post('/milestone-types')
					.send(milestoneType)
					.expect(200)
					.end(function(milestoneTypeSaveErr, milestoneTypeSaveRes) {
						// Handle Milestone type save error
						if (milestoneTypeSaveErr) done(milestoneTypeSaveErr);

						// Delete existing Milestone type
						agent.delete('/milestone-types/' + milestoneTypeSaveRes.body._id)
							.send(milestoneType)
							.expect(200)
							.end(function(milestoneTypeDeleteErr, milestoneTypeDeleteRes) {
								// Handle Milestone type error error
								if (milestoneTypeDeleteErr) done(milestoneTypeDeleteErr);

								// Set assertions
								(milestoneTypeDeleteRes.body._id).should.equal(milestoneTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Milestone type instance if not signed in', function(done) {
		// Set Milestone type user 
		milestoneType.user = user;

		// Create new Milestone type model instance
		var milestoneTypeObj = new MilestoneType(milestoneType);

		// Save the Milestone type
		milestoneTypeObj.save(function() {
			// Try deleting Milestone type
			request(app).delete('/milestone-types/' + milestoneTypeObj._id)
			.expect(401)
			.end(function(milestoneTypeDeleteErr, milestoneTypeDeleteRes) {
				// Set message assertion
				(milestoneTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Milestone type error error
				done(milestoneTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		MilestoneType.remove().exec();
		done();
	});
});