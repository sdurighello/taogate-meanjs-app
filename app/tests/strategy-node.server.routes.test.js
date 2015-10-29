'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	StrategyNode = mongoose.model('StrategyNode'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, strategyNode;

/**
 * Strategy node routes tests
 */
describe('Strategy node CRUD tests', function() {
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

		// Save a user to the test db and create new Strategy node
		user.save(function() {
			strategyNode = {
				name: 'Strategy node Name'
			};

			done();
		});
	});

	it('should be able to save Strategy node instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node
				agent.post('/strategy-nodes')
					.send(strategyNode)
					.expect(200)
					.end(function(strategyNodeSaveErr, strategyNodeSaveRes) {
						// Handle Strategy node save error
						if (strategyNodeSaveErr) done(strategyNodeSaveErr);

						// Get a list of Strategy nodes
						agent.get('/strategy-nodes')
							.end(function(strategyNodesGetErr, strategyNodesGetRes) {
								// Handle Strategy node save error
								if (strategyNodesGetErr) done(strategyNodesGetErr);

								// Get Strategy nodes list
								var strategyNodes = strategyNodesGetRes.body;

								// Set assertions
								(strategyNodes[0].user._id).should.equal(userId);
								(strategyNodes[0].name).should.match('Strategy node Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Strategy node instance if not logged in', function(done) {
		agent.post('/strategy-nodes')
			.send(strategyNode)
			.expect(401)
			.end(function(strategyNodeSaveErr, strategyNodeSaveRes) {
				// Call the assertion callback
				done(strategyNodeSaveErr);
			});
	});

	it('should not be able to save Strategy node instance if no name is provided', function(done) {
		// Invalidate name field
		strategyNode.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node
				agent.post('/strategy-nodes')
					.send(strategyNode)
					.expect(400)
					.end(function(strategyNodeSaveErr, strategyNodeSaveRes) {
						// Set message assertion
						(strategyNodeSaveRes.body.message).should.match('Please fill Strategy node name');
						
						// Handle Strategy node save error
						done(strategyNodeSaveErr);
					});
			});
	});

	it('should be able to update Strategy node instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node
				agent.post('/strategy-nodes')
					.send(strategyNode)
					.expect(200)
					.end(function(strategyNodeSaveErr, strategyNodeSaveRes) {
						// Handle Strategy node save error
						if (strategyNodeSaveErr) done(strategyNodeSaveErr);

						// Update Strategy node name
						strategyNode.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Strategy node
						agent.put('/strategy-nodes/' + strategyNodeSaveRes.body._id)
							.send(strategyNode)
							.expect(200)
							.end(function(strategyNodeUpdateErr, strategyNodeUpdateRes) {
								// Handle Strategy node update error
								if (strategyNodeUpdateErr) done(strategyNodeUpdateErr);

								// Set assertions
								(strategyNodeUpdateRes.body._id).should.equal(strategyNodeSaveRes.body._id);
								(strategyNodeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Strategy nodes if not signed in', function(done) {
		// Create new Strategy node model instance
		var strategyNodeObj = new StrategyNode(strategyNode);

		// Save the Strategy node
		strategyNodeObj.save(function() {
			// Request Strategy nodes
			request(app).get('/strategy-nodes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Strategy node if not signed in', function(done) {
		// Create new Strategy node model instance
		var strategyNodeObj = new StrategyNode(strategyNode);

		// Save the Strategy node
		strategyNodeObj.save(function() {
			request(app).get('/strategy-nodes/' + strategyNodeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', strategyNode.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Strategy node instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Strategy node
				agent.post('/strategy-nodes')
					.send(strategyNode)
					.expect(200)
					.end(function(strategyNodeSaveErr, strategyNodeSaveRes) {
						// Handle Strategy node save error
						if (strategyNodeSaveErr) done(strategyNodeSaveErr);

						// Delete existing Strategy node
						agent.delete('/strategy-nodes/' + strategyNodeSaveRes.body._id)
							.send(strategyNode)
							.expect(200)
							.end(function(strategyNodeDeleteErr, strategyNodeDeleteRes) {
								// Handle Strategy node error error
								if (strategyNodeDeleteErr) done(strategyNodeDeleteErr);

								// Set assertions
								(strategyNodeDeleteRes.body._id).should.equal(strategyNodeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Strategy node instance if not signed in', function(done) {
		// Set Strategy node user 
		strategyNode.user = user;

		// Create new Strategy node model instance
		var strategyNodeObj = new StrategyNode(strategyNode);

		// Save the Strategy node
		strategyNodeObj.save(function() {
			// Try deleting Strategy node
			request(app).delete('/strategy-nodes/' + strategyNodeObj._id)
			.expect(401)
			.end(function(strategyNodeDeleteErr, strategyNodeDeleteRes) {
				// Set message assertion
				(strategyNodeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Strategy node error error
				done(strategyNodeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		StrategyNode.remove().exec();
		done();
	});
});