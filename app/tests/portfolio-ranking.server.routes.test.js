'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioRanking = mongoose.model('PortfolioRanking'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioRanking;

/**
 * Portfolio ranking routes tests
 */
describe('Portfolio ranking CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio ranking
		user.save(function() {
			portfolioRanking = {
				name: 'Portfolio ranking Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio ranking instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio ranking
				agent.post('/portfolio-rankings')
					.send(portfolioRanking)
					.expect(200)
					.end(function(portfolioRankingSaveErr, portfolioRankingSaveRes) {
						// Handle Portfolio ranking save error
						if (portfolioRankingSaveErr) done(portfolioRankingSaveErr);

						// Get a list of Portfolio rankings
						agent.get('/portfolio-rankings')
							.end(function(portfolioRankingsGetErr, portfolioRankingsGetRes) {
								// Handle Portfolio ranking save error
								if (portfolioRankingsGetErr) done(portfolioRankingsGetErr);

								// Get Portfolio rankings list
								var portfolioRankings = portfolioRankingsGetRes.body;

								// Set assertions
								(portfolioRankings[0].user._id).should.equal(userId);
								(portfolioRankings[0].name).should.match('Portfolio ranking Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio ranking instance if not logged in', function(done) {
		agent.post('/portfolio-rankings')
			.send(portfolioRanking)
			.expect(401)
			.end(function(portfolioRankingSaveErr, portfolioRankingSaveRes) {
				// Call the assertion callback
				done(portfolioRankingSaveErr);
			});
	});

	it('should not be able to save Portfolio ranking instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioRanking.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio ranking
				agent.post('/portfolio-rankings')
					.send(portfolioRanking)
					.expect(400)
					.end(function(portfolioRankingSaveErr, portfolioRankingSaveRes) {
						// Set message assertion
						(portfolioRankingSaveRes.body.message).should.match('Please fill Portfolio ranking name');
						
						// Handle Portfolio ranking save error
						done(portfolioRankingSaveErr);
					});
			});
	});

	it('should be able to update Portfolio ranking instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio ranking
				agent.post('/portfolio-rankings')
					.send(portfolioRanking)
					.expect(200)
					.end(function(portfolioRankingSaveErr, portfolioRankingSaveRes) {
						// Handle Portfolio ranking save error
						if (portfolioRankingSaveErr) done(portfolioRankingSaveErr);

						// Update Portfolio ranking name
						portfolioRanking.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio ranking
						agent.put('/portfolio-rankings/' + portfolioRankingSaveRes.body._id)
							.send(portfolioRanking)
							.expect(200)
							.end(function(portfolioRankingUpdateErr, portfolioRankingUpdateRes) {
								// Handle Portfolio ranking update error
								if (portfolioRankingUpdateErr) done(portfolioRankingUpdateErr);

								// Set assertions
								(portfolioRankingUpdateRes.body._id).should.equal(portfolioRankingSaveRes.body._id);
								(portfolioRankingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio rankings if not signed in', function(done) {
		// Create new Portfolio ranking model instance
		var portfolioRankingObj = new PortfolioRanking(portfolioRanking);

		// Save the Portfolio ranking
		portfolioRankingObj.save(function() {
			// Request Portfolio rankings
			request(app).get('/portfolio-rankings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio ranking if not signed in', function(done) {
		// Create new Portfolio ranking model instance
		var portfolioRankingObj = new PortfolioRanking(portfolioRanking);

		// Save the Portfolio ranking
		portfolioRankingObj.save(function() {
			request(app).get('/portfolio-rankings/' + portfolioRankingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioRanking.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio ranking instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio ranking
				agent.post('/portfolio-rankings')
					.send(portfolioRanking)
					.expect(200)
					.end(function(portfolioRankingSaveErr, portfolioRankingSaveRes) {
						// Handle Portfolio ranking save error
						if (portfolioRankingSaveErr) done(portfolioRankingSaveErr);

						// Delete existing Portfolio ranking
						agent.delete('/portfolio-rankings/' + portfolioRankingSaveRes.body._id)
							.send(portfolioRanking)
							.expect(200)
							.end(function(portfolioRankingDeleteErr, portfolioRankingDeleteRes) {
								// Handle Portfolio ranking error error
								if (portfolioRankingDeleteErr) done(portfolioRankingDeleteErr);

								// Set assertions
								(portfolioRankingDeleteRes.body._id).should.equal(portfolioRankingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio ranking instance if not signed in', function(done) {
		// Set Portfolio ranking user 
		portfolioRanking.user = user;

		// Create new Portfolio ranking model instance
		var portfolioRankingObj = new PortfolioRanking(portfolioRanking);

		// Save the Portfolio ranking
		portfolioRankingObj.save(function() {
			// Try deleting Portfolio ranking
			request(app).delete('/portfolio-rankings/' + portfolioRankingObj._id)
			.expect(401)
			.end(function(portfolioRankingDeleteErr, portfolioRankingDeleteRes) {
				// Set message assertion
				(portfolioRankingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio ranking error error
				done(portfolioRankingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioRanking.remove().exec();
		done();
	});
});