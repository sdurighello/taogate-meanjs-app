'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateOutcomeScore = mongoose.model('GateOutcomeScore'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateOutcomeScore;

/**
 * Gate outcome score routes tests
 */
describe('Gate outcome score CRUD tests', function() {
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

		// Save a user to the test db and create new Gate outcome score
		user.save(function() {
			gateOutcomeScore = {
				name: 'Gate outcome score Name'
			};

			done();
		});
	});

	it('should be able to save Gate outcome score instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome score
				agent.post('/gate-outcome-scores')
					.send(gateOutcomeScore)
					.expect(200)
					.end(function(gateOutcomeScoreSaveErr, gateOutcomeScoreSaveRes) {
						// Handle Gate outcome score save error
						if (gateOutcomeScoreSaveErr) done(gateOutcomeScoreSaveErr);

						// Get a list of Gate outcome scores
						agent.get('/gate-outcome-scores')
							.end(function(gateOutcomeScoresGetErr, gateOutcomeScoresGetRes) {
								// Handle Gate outcome score save error
								if (gateOutcomeScoresGetErr) done(gateOutcomeScoresGetErr);

								// Get Gate outcome scores list
								var gateOutcomeScores = gateOutcomeScoresGetRes.body;

								// Set assertions
								(gateOutcomeScores[0].user._id).should.equal(userId);
								(gateOutcomeScores[0].name).should.match('Gate outcome score Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate outcome score instance if not logged in', function(done) {
		agent.post('/gate-outcome-scores')
			.send(gateOutcomeScore)
			.expect(401)
			.end(function(gateOutcomeScoreSaveErr, gateOutcomeScoreSaveRes) {
				// Call the assertion callback
				done(gateOutcomeScoreSaveErr);
			});
	});

	it('should not be able to save Gate outcome score instance if no name is provided', function(done) {
		// Invalidate name field
		gateOutcomeScore.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome score
				agent.post('/gate-outcome-scores')
					.send(gateOutcomeScore)
					.expect(400)
					.end(function(gateOutcomeScoreSaveErr, gateOutcomeScoreSaveRes) {
						// Set message assertion
						(gateOutcomeScoreSaveRes.body.message).should.match('Please fill Gate outcome score name');
						
						// Handle Gate outcome score save error
						done(gateOutcomeScoreSaveErr);
					});
			});
	});

	it('should be able to update Gate outcome score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome score
				agent.post('/gate-outcome-scores')
					.send(gateOutcomeScore)
					.expect(200)
					.end(function(gateOutcomeScoreSaveErr, gateOutcomeScoreSaveRes) {
						// Handle Gate outcome score save error
						if (gateOutcomeScoreSaveErr) done(gateOutcomeScoreSaveErr);

						// Update Gate outcome score name
						gateOutcomeScore.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate outcome score
						agent.put('/gate-outcome-scores/' + gateOutcomeScoreSaveRes.body._id)
							.send(gateOutcomeScore)
							.expect(200)
							.end(function(gateOutcomeScoreUpdateErr, gateOutcomeScoreUpdateRes) {
								// Handle Gate outcome score update error
								if (gateOutcomeScoreUpdateErr) done(gateOutcomeScoreUpdateErr);

								// Set assertions
								(gateOutcomeScoreUpdateRes.body._id).should.equal(gateOutcomeScoreSaveRes.body._id);
								(gateOutcomeScoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate outcome scores if not signed in', function(done) {
		// Create new Gate outcome score model instance
		var gateOutcomeScoreObj = new GateOutcomeScore(gateOutcomeScore);

		// Save the Gate outcome score
		gateOutcomeScoreObj.save(function() {
			// Request Gate outcome scores
			request(app).get('/gate-outcome-scores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate outcome score if not signed in', function(done) {
		// Create new Gate outcome score model instance
		var gateOutcomeScoreObj = new GateOutcomeScore(gateOutcomeScore);

		// Save the Gate outcome score
		gateOutcomeScoreObj.save(function() {
			request(app).get('/gate-outcome-scores/' + gateOutcomeScoreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateOutcomeScore.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate outcome score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome score
				agent.post('/gate-outcome-scores')
					.send(gateOutcomeScore)
					.expect(200)
					.end(function(gateOutcomeScoreSaveErr, gateOutcomeScoreSaveRes) {
						// Handle Gate outcome score save error
						if (gateOutcomeScoreSaveErr) done(gateOutcomeScoreSaveErr);

						// Delete existing Gate outcome score
						agent.delete('/gate-outcome-scores/' + gateOutcomeScoreSaveRes.body._id)
							.send(gateOutcomeScore)
							.expect(200)
							.end(function(gateOutcomeScoreDeleteErr, gateOutcomeScoreDeleteRes) {
								// Handle Gate outcome score error error
								if (gateOutcomeScoreDeleteErr) done(gateOutcomeScoreDeleteErr);

								// Set assertions
								(gateOutcomeScoreDeleteRes.body._id).should.equal(gateOutcomeScoreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate outcome score instance if not signed in', function(done) {
		// Set Gate outcome score user 
		gateOutcomeScore.user = user;

		// Create new Gate outcome score model instance
		var gateOutcomeScoreObj = new GateOutcomeScore(gateOutcomeScore);

		// Save the Gate outcome score
		gateOutcomeScoreObj.save(function() {
			// Try deleting Gate outcome score
			request(app).delete('/gate-outcome-scores/' + gateOutcomeScoreObj._id)
			.expect(401)
			.end(function(gateOutcomeScoreDeleteErr, gateOutcomeScoreDeleteRes) {
				// Set message assertion
				(gateOutcomeScoreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate outcome score error error
				done(gateOutcomeScoreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateOutcomeScore.remove().exec();
		done();
	});
});