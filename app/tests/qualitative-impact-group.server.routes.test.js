'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QualitativeImpactGroup = mongoose.model('QualitativeImpactGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, qualitativeImpactGroup;

/**
 * Qualitative impact group routes tests
 */
describe('Qualitative impact group CRUD tests', function() {
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

		// Save a user to the test db and create new Qualitative impact group
		user.save(function() {
			qualitativeImpactGroup = {
				name: 'Qualitative impact group Name'
			};

			done();
		});
	});

	it('should be able to save Qualitative impact group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact group
				agent.post('/qualitative-impact-groups')
					.send(qualitativeImpactGroup)
					.expect(200)
					.end(function(qualitativeImpactGroupSaveErr, qualitativeImpactGroupSaveRes) {
						// Handle Qualitative impact group save error
						if (qualitativeImpactGroupSaveErr) done(qualitativeImpactGroupSaveErr);

						// Get a list of Qualitative impact groups
						agent.get('/qualitative-impact-groups')
							.end(function(qualitativeImpactGroupsGetErr, qualitativeImpactGroupsGetRes) {
								// Handle Qualitative impact group save error
								if (qualitativeImpactGroupsGetErr) done(qualitativeImpactGroupsGetErr);

								// Get Qualitative impact groups list
								var qualitativeImpactGroups = qualitativeImpactGroupsGetRes.body;

								// Set assertions
								(qualitativeImpactGroups[0].user._id).should.equal(userId);
								(qualitativeImpactGroups[0].name).should.match('Qualitative impact group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Qualitative impact group instance if not logged in', function(done) {
		agent.post('/qualitative-impact-groups')
			.send(qualitativeImpactGroup)
			.expect(401)
			.end(function(qualitativeImpactGroupSaveErr, qualitativeImpactGroupSaveRes) {
				// Call the assertion callback
				done(qualitativeImpactGroupSaveErr);
			});
	});

	it('should not be able to save Qualitative impact group instance if no name is provided', function(done) {
		// Invalidate name field
		qualitativeImpactGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact group
				agent.post('/qualitative-impact-groups')
					.send(qualitativeImpactGroup)
					.expect(400)
					.end(function(qualitativeImpactGroupSaveErr, qualitativeImpactGroupSaveRes) {
						// Set message assertion
						(qualitativeImpactGroupSaveRes.body.message).should.match('Please fill Qualitative impact group name');
						
						// Handle Qualitative impact group save error
						done(qualitativeImpactGroupSaveErr);
					});
			});
	});

	it('should be able to update Qualitative impact group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact group
				agent.post('/qualitative-impact-groups')
					.send(qualitativeImpactGroup)
					.expect(200)
					.end(function(qualitativeImpactGroupSaveErr, qualitativeImpactGroupSaveRes) {
						// Handle Qualitative impact group save error
						if (qualitativeImpactGroupSaveErr) done(qualitativeImpactGroupSaveErr);

						// Update Qualitative impact group name
						qualitativeImpactGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Qualitative impact group
						agent.put('/qualitative-impact-groups/' + qualitativeImpactGroupSaveRes.body._id)
							.send(qualitativeImpactGroup)
							.expect(200)
							.end(function(qualitativeImpactGroupUpdateErr, qualitativeImpactGroupUpdateRes) {
								// Handle Qualitative impact group update error
								if (qualitativeImpactGroupUpdateErr) done(qualitativeImpactGroupUpdateErr);

								// Set assertions
								(qualitativeImpactGroupUpdateRes.body._id).should.equal(qualitativeImpactGroupSaveRes.body._id);
								(qualitativeImpactGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Qualitative impact groups if not signed in', function(done) {
		// Create new Qualitative impact group model instance
		var qualitativeImpactGroupObj = new QualitativeImpactGroup(qualitativeImpactGroup);

		// Save the Qualitative impact group
		qualitativeImpactGroupObj.save(function() {
			// Request Qualitative impact groups
			request(app).get('/qualitative-impact-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Qualitative impact group if not signed in', function(done) {
		// Create new Qualitative impact group model instance
		var qualitativeImpactGroupObj = new QualitativeImpactGroup(qualitativeImpactGroup);

		// Save the Qualitative impact group
		qualitativeImpactGroupObj.save(function() {
			request(app).get('/qualitative-impact-groups/' + qualitativeImpactGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', qualitativeImpactGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Qualitative impact group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Qualitative impact group
				agent.post('/qualitative-impact-groups')
					.send(qualitativeImpactGroup)
					.expect(200)
					.end(function(qualitativeImpactGroupSaveErr, qualitativeImpactGroupSaveRes) {
						// Handle Qualitative impact group save error
						if (qualitativeImpactGroupSaveErr) done(qualitativeImpactGroupSaveErr);

						// Delete existing Qualitative impact group
						agent.delete('/qualitative-impact-groups/' + qualitativeImpactGroupSaveRes.body._id)
							.send(qualitativeImpactGroup)
							.expect(200)
							.end(function(qualitativeImpactGroupDeleteErr, qualitativeImpactGroupDeleteRes) {
								// Handle Qualitative impact group error error
								if (qualitativeImpactGroupDeleteErr) done(qualitativeImpactGroupDeleteErr);

								// Set assertions
								(qualitativeImpactGroupDeleteRes.body._id).should.equal(qualitativeImpactGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Qualitative impact group instance if not signed in', function(done) {
		// Set Qualitative impact group user 
		qualitativeImpactGroup.user = user;

		// Create new Qualitative impact group model instance
		var qualitativeImpactGroupObj = new QualitativeImpactGroup(qualitativeImpactGroup);

		// Save the Qualitative impact group
		qualitativeImpactGroupObj.save(function() {
			// Try deleting Qualitative impact group
			request(app).delete('/qualitative-impact-groups/' + qualitativeImpactGroupObj._id)
			.expect(401)
			.end(function(qualitativeImpactGroupDeleteErr, qualitativeImpactGroupDeleteRes) {
				// Set message assertion
				(qualitativeImpactGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Qualitative impact group error error
				done(qualitativeImpactGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		QualitativeImpactGroup.remove().exec();
		done();
	});
});