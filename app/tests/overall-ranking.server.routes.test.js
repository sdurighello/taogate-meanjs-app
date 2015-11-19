'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	OverallRanking = mongoose.model('OverallRanking'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, overallRanking;

/**
 * Overall ranking routes tests
 */
describe('Overall ranking CRUD tests', function() {
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

		// Save a user to the test db and create new Overall ranking
		user.save(function() {
			overallRanking = {
				name: 'Overall ranking Name'
			};

			done();
		});
	});

	it('should be able to save Overall ranking instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overall ranking
				agent.post('/overall-rankings')
					.send(overallRanking)
					.expect(200)
					.end(function(overallRankingSaveErr, overallRankingSaveRes) {
						// Handle Overall ranking save error
						if (overallRankingSaveErr) done(overallRankingSaveErr);

						// Get a list of Overall rankings
						agent.get('/overall-rankings')
							.end(function(overallRankingsGetErr, overallRankingsGetRes) {
								// Handle Overall ranking save error
								if (overallRankingsGetErr) done(overallRankingsGetErr);

								// Get Overall rankings list
								var overallRankings = overallRankingsGetRes.body;

								// Set assertions
								(overallRankings[0].user._id).should.equal(userId);
								(overallRankings[0].name).should.match('Overall ranking Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Overall ranking instance if not logged in', function(done) {
		agent.post('/overall-rankings')
			.send(overallRanking)
			.expect(401)
			.end(function(overallRankingSaveErr, overallRankingSaveRes) {
				// Call the assertion callback
				done(overallRankingSaveErr);
			});
	});

	it('should not be able to save Overall ranking instance if no name is provided', function(done) {
		// Invalidate name field
		overallRanking.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overall ranking
				agent.post('/overall-rankings')
					.send(overallRanking)
					.expect(400)
					.end(function(overallRankingSaveErr, overallRankingSaveRes) {
						// Set message assertion
						(overallRankingSaveRes.body.message).should.match('Please fill Overall ranking name');
						
						// Handle Overall ranking save error
						done(overallRankingSaveErr);
					});
			});
	});

	it('should be able to update Overall ranking instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overall ranking
				agent.post('/overall-rankings')
					.send(overallRanking)
					.expect(200)
					.end(function(overallRankingSaveErr, overallRankingSaveRes) {
						// Handle Overall ranking save error
						if (overallRankingSaveErr) done(overallRankingSaveErr);

						// Update Overall ranking name
						overallRanking.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Overall ranking
						agent.put('/overall-rankings/' + overallRankingSaveRes.body._id)
							.send(overallRanking)
							.expect(200)
							.end(function(overallRankingUpdateErr, overallRankingUpdateRes) {
								// Handle Overall ranking update error
								if (overallRankingUpdateErr) done(overallRankingUpdateErr);

								// Set assertions
								(overallRankingUpdateRes.body._id).should.equal(overallRankingSaveRes.body._id);
								(overallRankingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Overall rankings if not signed in', function(done) {
		// Create new Overall ranking model instance
		var overallRankingObj = new OverallRanking(overallRanking);

		// Save the Overall ranking
		overallRankingObj.save(function() {
			// Request Overall rankings
			request(app).get('/overall-rankings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Overall ranking if not signed in', function(done) {
		// Create new Overall ranking model instance
		var overallRankingObj = new OverallRanking(overallRanking);

		// Save the Overall ranking
		overallRankingObj.save(function() {
			request(app).get('/overall-rankings/' + overallRankingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', overallRanking.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Overall ranking instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Overall ranking
				agent.post('/overall-rankings')
					.send(overallRanking)
					.expect(200)
					.end(function(overallRankingSaveErr, overallRankingSaveRes) {
						// Handle Overall ranking save error
						if (overallRankingSaveErr) done(overallRankingSaveErr);

						// Delete existing Overall ranking
						agent.delete('/overall-rankings/' + overallRankingSaveRes.body._id)
							.send(overallRanking)
							.expect(200)
							.end(function(overallRankingDeleteErr, overallRankingDeleteRes) {
								// Handle Overall ranking error error
								if (overallRankingDeleteErr) done(overallRankingDeleteErr);

								// Set assertions
								(overallRankingDeleteRes.body._id).should.equal(overallRankingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Overall ranking instance if not signed in', function(done) {
		// Set Overall ranking user 
		overallRanking.user = user;

		// Create new Overall ranking model instance
		var overallRankingObj = new OverallRanking(overallRanking);

		// Save the Overall ranking
		overallRankingObj.save(function() {
			// Try deleting Overall ranking
			request(app).delete('/overall-rankings/' + overallRankingObj._id)
			.expect(401)
			.end(function(overallRankingDeleteErr, overallRankingDeleteRes) {
				// Set message assertion
				(overallRankingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Overall ranking error error
				done(overallRankingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		OverallRanking.remove().exec();
		done();
	});
});