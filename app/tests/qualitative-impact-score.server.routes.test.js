'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QualitativeImpactScore = mongoose.model('QualitativeImpactScore'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, qualitativeImpactScore;

/**
 * Qualitative impact score routes tests
 */
describe('Qualitative impact score CRUD tests', function() {
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

		// Save a user to the test db and create new Qualitative impact score
		user.save(function() {
			qualitativeImpactScore = {
				name: 'Qualitative impact score Name'
			};

			done();
		});
	});

	it('should be able to save Qualitative impact score instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact score
				agent.post('/qualitative-impact-scores')
					.send(qualitativeImpactScore)
					.expect(200)
					.end(function(qualitativeImpactScoreSaveErr, qualitativeImpactScoreSaveRes) {
						// Handle Qualitative impact score save error
						if (qualitativeImpactScoreSaveErr) done(qualitativeImpactScoreSaveErr);

						// Get a list of Qualitative impact scores
						agent.get('/qualitative-impact-scores')
							.end(function(qualitativeImpactScoresGetErr, qualitativeImpactScoresGetRes) {
								// Handle Qualitative impact score save error
								if (qualitativeImpactScoresGetErr) done(qualitativeImpactScoresGetErr);

								// Get Qualitative impact scores list
								var qualitativeImpactScores = qualitativeImpactScoresGetRes.body;

								// Set assertions
								(qualitativeImpactScores[0].user._id).should.equal(userId);
								(qualitativeImpactScores[0].name).should.match('Qualitative impact score Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Qualitative impact score instance if not logged in', function(done) {
		agent.post('/qualitative-impact-scores')
			.send(qualitativeImpactScore)
			.expect(401)
			.end(function(qualitativeImpactScoreSaveErr, qualitativeImpactScoreSaveRes) {
				// Call the assertion callback
				done(qualitativeImpactScoreSaveErr);
			});
	});

	it('should not be able to save Qualitative impact score instance if no name is provided', function(done) {
		// Invalidate name field
		qualitativeImpactScore.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact score
				agent.post('/qualitative-impact-scores')
					.send(qualitativeImpactScore)
					.expect(400)
					.end(function(qualitativeImpactScoreSaveErr, qualitativeImpactScoreSaveRes) {
						// Set message assertion
						(qualitativeImpactScoreSaveRes.body.message).should.match('Please fill Qualitative impact score name');
						
						// Handle Qualitative impact score save error
						done(qualitativeImpactScoreSaveErr);
					});
			});
	});

	it('should be able to update Qualitative impact score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact score
				agent.post('/qualitative-impact-scores')
					.send(qualitativeImpactScore)
					.expect(200)
					.end(function(qualitativeImpactScoreSaveErr, qualitativeImpactScoreSaveRes) {
						// Handle Qualitative impact score save error
						if (qualitativeImpactScoreSaveErr) done(qualitativeImpactScoreSaveErr);

						// Update Qualitative impact score name
						qualitativeImpactScore.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Qualitative impact score
						agent.put('/qualitative-impact-scores/' + qualitativeImpactScoreSaveRes.body._id)
							.send(qualitativeImpactScore)
							.expect(200)
							.end(function(qualitativeImpactScoreUpdateErr, qualitativeImpactScoreUpdateRes) {
								// Handle Qualitative impact score update error
								if (qualitativeImpactScoreUpdateErr) done(qualitativeImpactScoreUpdateErr);

								// Set assertions
								(qualitativeImpactScoreUpdateRes.body._id).should.equal(qualitativeImpactScoreSaveRes.body._id);
								(qualitativeImpactScoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Qualitative impact scores if not signed in', function(done) {
		// Create new Qualitative impact score model instance
		var qualitativeImpactScoreObj = new QualitativeImpactScore(qualitativeImpactScore);

		// Save the Qualitative impact score
		qualitativeImpactScoreObj.save(function() {
			// Request Qualitative impact scores
			request(app).get('/qualitative-impact-scores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Qualitative impact score if not signed in', function(done) {
		// Create new Qualitative impact score model instance
		var qualitativeImpactScoreObj = new QualitativeImpactScore(qualitativeImpactScore);

		// Save the Qualitative impact score
		qualitativeImpactScoreObj.save(function() {
			request(app).get('/qualitative-impact-scores/' + qualitativeImpactScoreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', qualitativeImpactScore.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Qualitative impact score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact score
				agent.post('/qualitative-impact-scores')
					.send(qualitativeImpactScore)
					.expect(200)
					.end(function(qualitativeImpactScoreSaveErr, qualitativeImpactScoreSaveRes) {
						// Handle Qualitative impact score save error
						if (qualitativeImpactScoreSaveErr) done(qualitativeImpactScoreSaveErr);

						// Delete existing Qualitative impact score
						agent.delete('/qualitative-impact-scores/' + qualitativeImpactScoreSaveRes.body._id)
							.send(qualitativeImpactScore)
							.expect(200)
							.end(function(qualitativeImpactScoreDeleteErr, qualitativeImpactScoreDeleteRes) {
								// Handle Qualitative impact score error error
								if (qualitativeImpactScoreDeleteErr) done(qualitativeImpactScoreDeleteErr);

								// Set assertions
								(qualitativeImpactScoreDeleteRes.body._id).should.equal(qualitativeImpactScoreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Qualitative impact score instance if not signed in', function(done) {
		// Set Qualitative impact score user 
		qualitativeImpactScore.user = user;

		// Create new Qualitative impact score model instance
		var qualitativeImpactScoreObj = new QualitativeImpactScore(qualitativeImpactScore);

		// Save the Qualitative impact score
		qualitativeImpactScoreObj.save(function() {
			// Try deleting Qualitative impact score
			request(app).delete('/qualitative-impact-scores/' + qualitativeImpactScoreObj._id)
			.expect(401)
			.end(function(qualitativeImpactScoreDeleteErr, qualitativeImpactScoreDeleteRes) {
				// Set message assertion
				(qualitativeImpactScoreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Qualitative impact score error error
				done(qualitativeImpactScoreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		QualitativeImpactScore.remove().exec();
		done();
	});
});