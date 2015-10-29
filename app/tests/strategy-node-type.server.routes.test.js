'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	StrategyNodeType = mongoose.model('StrategyNodeType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, strategyNodeType;

/**
 * Strategy node type routes tests
 */
describe('Strategy node type CRUD tests', function() {
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

		// Save a user to the test db and create new Strategy node type
		user.save(function() {
			strategyNodeType = {
				name: 'Strategy node type Name'
			};

			done();
		});
	});

	it('should be able to save Strategy node type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node type
				agent.post('/strategy-node-types')
					.send(strategyNodeType)
					.expect(200)
					.end(function(strategyNodeTypeSaveErr, strategyNodeTypeSaveRes) {
						// Handle Strategy node type save error
						if (strategyNodeTypeSaveErr) done(strategyNodeTypeSaveErr);

						// Get a list of Strategy node types
						agent.get('/strategy-node-types')
							.end(function(strategyNodeTypesGetErr, strategyNodeTypesGetRes) {
								// Handle Strategy node type save error
								if (strategyNodeTypesGetErr) done(strategyNodeTypesGetErr);

								// Get Strategy node types list
								var strategyNodeTypes = strategyNodeTypesGetRes.body;

								// Set assertions
								(strategyNodeTypes[0].user._id).should.equal(userId);
								(strategyNodeTypes[0].name).should.match('Strategy node type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Strategy node type instance if not logged in', function(done) {
		agent.post('/strategy-node-types')
			.send(strategyNodeType)
			.expect(401)
			.end(function(strategyNodeTypeSaveErr, strategyNodeTypeSaveRes) {
				// Call the assertion callback
				done(strategyNodeTypeSaveErr);
			});
	});

	it('should not be able to save Strategy node type instance if no name is provided', function(done) {
		// Invalidate name field
		strategyNodeType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node type
				agent.post('/strategy-node-types')
					.send(strategyNodeType)
					.expect(400)
					.end(function(strategyNodeTypeSaveErr, strategyNodeTypeSaveRes) {
						// Set message assertion
						(strategyNodeTypeSaveRes.body.message).should.match('Please fill Strategy node type name');
						
						// Handle Strategy node type save error
						done(strategyNodeTypeSaveErr);
					});
			});
	});

	it('should be able to update Strategy node type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node type
				agent.post('/strategy-node-types')
					.send(strategyNodeType)
					.expect(200)
					.end(function(strategyNodeTypeSaveErr, strategyNodeTypeSaveRes) {
						// Handle Strategy node type save error
						if (strategyNodeTypeSaveErr) done(strategyNodeTypeSaveErr);

						// Update Strategy node type name
						strategyNodeType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Strategy node type
						agent.put('/strategy-node-types/' + strategyNodeTypeSaveRes.body._id)
							.send(strategyNodeType)
							.expect(200)
							.end(function(strategyNodeTypeUpdateErr, strategyNodeTypeUpdateRes) {
								// Handle Strategy node type update error
								if (strategyNodeTypeUpdateErr) done(strategyNodeTypeUpdateErr);

								// Set assertions
								(strategyNodeTypeUpdateRes.body._id).should.equal(strategyNodeTypeSaveRes.body._id);
								(strategyNodeTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Strategy node types if not signed in', function(done) {
		// Create new Strategy node type model instance
		var strategyNodeTypeObj = new StrategyNodeType(strategyNodeType);

		// Save the Strategy node type
		strategyNodeTypeObj.save(function() {
			// Request Strategy node types
			request(app).get('/strategy-node-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Strategy node type if not signed in', function(done) {
		// Create new Strategy node type model instance
		var strategyNodeTypeObj = new StrategyNodeType(strategyNodeType);

		// Save the Strategy node type
		strategyNodeTypeObj.save(function() {
			request(app).get('/strategy-node-types/' + strategyNodeTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', strategyNodeType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Strategy node type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node type
				agent.post('/strategy-node-types')
					.send(strategyNodeType)
					.expect(200)
					.end(function(strategyNodeTypeSaveErr, strategyNodeTypeSaveRes) {
						// Handle Strategy node type save error
						if (strategyNodeTypeSaveErr) done(strategyNodeTypeSaveErr);

						// Delete existing Strategy node type
						agent.delete('/strategy-node-types/' + strategyNodeTypeSaveRes.body._id)
							.send(strategyNodeType)
							.expect(200)
							.end(function(strategyNodeTypeDeleteErr, strategyNodeTypeDeleteRes) {
								// Handle Strategy node type error error
								if (strategyNodeTypeDeleteErr) done(strategyNodeTypeDeleteErr);

								// Set assertions
								(strategyNodeTypeDeleteRes.body._id).should.equal(strategyNodeTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Strategy node type instance if not signed in', function(done) {
		// Set Strategy node type user 
		strategyNodeType.user = user;

		// Create new Strategy node type model instance
		var strategyNodeTypeObj = new StrategyNodeType(strategyNodeType);

		// Save the Strategy node type
		strategyNodeTypeObj.save(function() {
			// Try deleting Strategy node type
			request(app).delete('/strategy-node-types/' + strategyNodeTypeObj._id)
			.expect(401)
			.end(function(strategyNodeTypeDeleteErr, strategyNodeTypeDeleteRes) {
				// Set message assertion
				(strategyNodeTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Strategy node type error error
				done(strategyNodeTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		StrategyNodeType.remove().exec();
		done();
	});
});