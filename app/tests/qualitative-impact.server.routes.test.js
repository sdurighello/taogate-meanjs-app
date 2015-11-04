'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QualitativeImpact = mongoose.model('QualitativeImpact'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, qualitativeImpact;

/**
 * Qualitative impact routes tests
 */
describe('Qualitative impact CRUD tests', function() {
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

		// Save a user to the test db and create new Qualitative impact
		user.save(function() {
			qualitativeImpact = {
				name: 'Qualitative impact Name'
			};

			done();
		});
	});

	it('should be able to save Qualitative impact instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact
				agent.post('/qualitative-impacts')
					.send(qualitativeImpact)
					.expect(200)
					.end(function(qualitativeImpactSaveErr, qualitativeImpactSaveRes) {
						// Handle Qualitative impact save error
						if (qualitativeImpactSaveErr) done(qualitativeImpactSaveErr);

						// Get a list of Qualitative impacts
						agent.get('/qualitative-impacts')
							.end(function(qualitativeImpactsGetErr, qualitativeImpactsGetRes) {
								// Handle Qualitative impact save error
								if (qualitativeImpactsGetErr) done(qualitativeImpactsGetErr);

								// Get Qualitative impacts list
								var qualitativeImpacts = qualitativeImpactsGetRes.body;

								// Set assertions
								(qualitativeImpacts[0].user._id).should.equal(userId);
								(qualitativeImpacts[0].name).should.match('Qualitative impact Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Qualitative impact instance if not logged in', function(done) {
		agent.post('/qualitative-impacts')
			.send(qualitativeImpact)
			.expect(401)
			.end(function(qualitativeImpactSaveErr, qualitativeImpactSaveRes) {
				// Call the assertion callback
				done(qualitativeImpactSaveErr);
			});
	});

	it('should not be able to save Qualitative impact instance if no name is provided', function(done) {
		// Invalidate name field
		qualitativeImpact.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact
				agent.post('/qualitative-impacts')
					.send(qualitativeImpact)
					.expect(400)
					.end(function(qualitativeImpactSaveErr, qualitativeImpactSaveRes) {
						// Set message assertion
						(qualitativeImpactSaveRes.body.message).should.match('Please fill Qualitative impact name');
						
						// Handle Qualitative impact save error
						done(qualitativeImpactSaveErr);
					});
			});
	});

	it('should be able to update Qualitative impact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact
				agent.post('/qualitative-impacts')
					.send(qualitativeImpact)
					.expect(200)
					.end(function(qualitativeImpactSaveErr, qualitativeImpactSaveRes) {
						// Handle Qualitative impact save error
						if (qualitativeImpactSaveErr) done(qualitativeImpactSaveErr);

						// Update Qualitative impact name
						qualitativeImpact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Qualitative impact
						agent.put('/qualitative-impacts/' + qualitativeImpactSaveRes.body._id)
							.send(qualitativeImpact)
							.expect(200)
							.end(function(qualitativeImpactUpdateErr, qualitativeImpactUpdateRes) {
								// Handle Qualitative impact update error
								if (qualitativeImpactUpdateErr) done(qualitativeImpactUpdateErr);

								// Set assertions
								(qualitativeImpactUpdateRes.body._id).should.equal(qualitativeImpactSaveRes.body._id);
								(qualitativeImpactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Qualitative impacts if not signed in', function(done) {
		// Create new Qualitative impact model instance
		var qualitativeImpactObj = new QualitativeImpact(qualitativeImpact);

		// Save the Qualitative impact
		qualitativeImpactObj.save(function() {
			// Request Qualitative impacts
			request(app).get('/qualitative-impacts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Qualitative impact if not signed in', function(done) {
		// Create new Qualitative impact model instance
		var qualitativeImpactObj = new QualitativeImpact(qualitativeImpact);

		// Save the Qualitative impact
		qualitativeImpactObj.save(function() {
			request(app).get('/qualitative-impacts/' + qualitativeImpactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', qualitativeImpact.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Qualitative impact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact
				agent.post('/qualitative-impacts')
					.send(qualitativeImpact)
					.expect(200)
					.end(function(qualitativeImpactSaveErr, qualitativeImpactSaveRes) {
						// Handle Qualitative impact save error
						if (qualitativeImpactSaveErr) done(qualitativeImpactSaveErr);

						// Delete existing Qualitative impact
						agent.delete('/qualitative-impacts/' + qualitativeImpactSaveRes.body._id)
							.send(qualitativeImpact)
							.expect(200)
							.end(function(qualitativeImpactDeleteErr, qualitativeImpactDeleteRes) {
								// Handle Qualitative impact error error
								if (qualitativeImpactDeleteErr) done(qualitativeImpactDeleteErr);

								// Set assertions
								(qualitativeImpactDeleteRes.body._id).should.equal(qualitativeImpactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Qualitative impact instance if not signed in', function(done) {
		// Set Qualitative impact user 
		qualitativeImpact.user = user;

		// Create new Qualitative impact model instance
		var qualitativeImpactObj = new QualitativeImpact(qualitativeImpact);

		// Save the Qualitative impact
		qualitativeImpactObj.save(function() {
			// Try deleting Qualitative impact
			request(app).delete('/qualitative-impacts/' + qualitativeImpactObj._id)
			.expect(401)
			.end(function(qualitativeImpactDeleteErr, qualitativeImpactDeleteRes) {
				// Set message assertion
				(qualitativeImpactDeleteRes.body.message).should.match('User is not logged in');

				// Handle Qualitative impact error error
				done(qualitativeImpactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		QualitativeImpact.remove().exec();
		done();
	});
});