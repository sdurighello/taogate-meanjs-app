'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CostType = mongoose.model('CostType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, costType;

/**
 * Cost type routes tests
 */
describe('Cost type CRUD tests', function() {
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

		// Save a user to the test db and create new Cost type
		user.save(function() {
			costType = {
				name: 'Cost type Name'
			};

			done();
		});
	});

	it('should be able to save Cost type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cost type
				agent.post('/cost-types')
					.send(costType)
					.expect(200)
					.end(function(costTypeSaveErr, costTypeSaveRes) {
						// Handle Cost type save error
						if (costTypeSaveErr) done(costTypeSaveErr);

						// Get a list of Cost types
						agent.get('/cost-types')
							.end(function(costTypesGetErr, costTypesGetRes) {
								// Handle Cost type save error
								if (costTypesGetErr) done(costTypesGetErr);

								// Get Cost types list
								var costTypes = costTypesGetRes.body;

								// Set assertions
								(costTypes[0].user._id).should.equal(userId);
								(costTypes[0].name).should.match('Cost type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cost type instance if not logged in', function(done) {
		agent.post('/cost-types')
			.send(costType)
			.expect(401)
			.end(function(costTypeSaveErr, costTypeSaveRes) {
				// Call the assertion callback
				done(costTypeSaveErr);
			});
	});

	it('should not be able to save Cost type instance if no name is provided', function(done) {
		// Invalidate name field
		costType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cost type
				agent.post('/cost-types')
					.send(costType)
					.expect(400)
					.end(function(costTypeSaveErr, costTypeSaveRes) {
						// Set message assertion
						(costTypeSaveRes.body.message).should.match('Please fill Cost type name');
						
						// Handle Cost type save error
						done(costTypeSaveErr);
					});
			});
	});

	it('should be able to update Cost type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cost type
				agent.post('/cost-types')
					.send(costType)
					.expect(200)
					.end(function(costTypeSaveErr, costTypeSaveRes) {
						// Handle Cost type save error
						if (costTypeSaveErr) done(costTypeSaveErr);

						// Update Cost type name
						costType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cost type
						agent.put('/cost-types/' + costTypeSaveRes.body._id)
							.send(costType)
							.expect(200)
							.end(function(costTypeUpdateErr, costTypeUpdateRes) {
								// Handle Cost type update error
								if (costTypeUpdateErr) done(costTypeUpdateErr);

								// Set assertions
								(costTypeUpdateRes.body._id).should.equal(costTypeSaveRes.body._id);
								(costTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cost types if not signed in', function(done) {
		// Create new Cost type model instance
		var costTypeObj = new CostType(costType);

		// Save the Cost type
		costTypeObj.save(function() {
			// Request Cost types
			request(app).get('/cost-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cost type if not signed in', function(done) {
		// Create new Cost type model instance
		var costTypeObj = new CostType(costType);

		// Save the Cost type
		costTypeObj.save(function() {
			request(app).get('/cost-types/' + costTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', costType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cost type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cost type
				agent.post('/cost-types')
					.send(costType)
					.expect(200)
					.end(function(costTypeSaveErr, costTypeSaveRes) {
						// Handle Cost type save error
						if (costTypeSaveErr) done(costTypeSaveErr);

						// Delete existing Cost type
						agent.delete('/cost-types/' + costTypeSaveRes.body._id)
							.send(costType)
							.expect(200)
							.end(function(costTypeDeleteErr, costTypeDeleteRes) {
								// Handle Cost type error error
								if (costTypeDeleteErr) done(costTypeDeleteErr);

								// Set assertions
								(costTypeDeleteRes.body._id).should.equal(costTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cost type instance if not signed in', function(done) {
		// Set Cost type user 
		costType.user = user;

		// Create new Cost type model instance
		var costTypeObj = new CostType(costType);

		// Save the Cost type
		costTypeObj.save(function() {
			// Try deleting Cost type
			request(app).delete('/cost-types/' + costTypeObj._id)
			.expect(401)
			.end(function(costTypeDeleteErr, costTypeDeleteRes) {
				// Set message assertion
				(costTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cost type error error
				done(costTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		CostType.remove().exec();
		done();
	});
});