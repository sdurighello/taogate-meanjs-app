'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateProcessTemplate = mongoose.model('GateProcessTemplate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateProcessTemplate;

/**
 * Gate process template routes tests
 */
describe('Gate process template CRUD tests', function() {
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

		// Save a user to the test db and create new Gate process template
		user.save(function() {
			gateProcessTemplate = {
				name: 'Gate process template Name'
			};

			done();
		});
	});

	it('should be able to save Gate process template instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process template
				agent.post('/gate-process-templates')
					.send(gateProcessTemplate)
					.expect(200)
					.end(function(gateProcessTemplateSaveErr, gateProcessTemplateSaveRes) {
						// Handle Gate process template save error
						if (gateProcessTemplateSaveErr) done(gateProcessTemplateSaveErr);

						// Get a list of Gate process templates
						agent.get('/gate-process-templates')
							.end(function(gateProcessTemplatesGetErr, gateProcessTemplatesGetRes) {
								// Handle Gate process template save error
								if (gateProcessTemplatesGetErr) done(gateProcessTemplatesGetErr);

								// Get Gate process templates list
								var gateProcessTemplates = gateProcessTemplatesGetRes.body;

								// Set assertions
								(gateProcessTemplates[0].user._id).should.equal(userId);
								(gateProcessTemplates[0].name).should.match('Gate process template Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate process template instance if not logged in', function(done) {
		agent.post('/gate-process-templates')
			.send(gateProcessTemplate)
			.expect(401)
			.end(function(gateProcessTemplateSaveErr, gateProcessTemplateSaveRes) {
				// Call the assertion callback
				done(gateProcessTemplateSaveErr);
			});
	});

	it('should not be able to save Gate process template instance if no name is provided', function(done) {
		// Invalidate name field
		gateProcessTemplate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process template
				agent.post('/gate-process-templates')
					.send(gateProcessTemplate)
					.expect(400)
					.end(function(gateProcessTemplateSaveErr, gateProcessTemplateSaveRes) {
						// Set message assertion
						(gateProcessTemplateSaveRes.body.message).should.match('Please fill Gate process template name');
						
						// Handle Gate process template save error
						done(gateProcessTemplateSaveErr);
					});
			});
	});

	it('should be able to update Gate process template instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process template
				agent.post('/gate-process-templates')
					.send(gateProcessTemplate)
					.expect(200)
					.end(function(gateProcessTemplateSaveErr, gateProcessTemplateSaveRes) {
						// Handle Gate process template save error
						if (gateProcessTemplateSaveErr) done(gateProcessTemplateSaveErr);

						// Update Gate process template name
						gateProcessTemplate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate process template
						agent.put('/gate-process-templates/' + gateProcessTemplateSaveRes.body._id)
							.send(gateProcessTemplate)
							.expect(200)
							.end(function(gateProcessTemplateUpdateErr, gateProcessTemplateUpdateRes) {
								// Handle Gate process template update error
								if (gateProcessTemplateUpdateErr) done(gateProcessTemplateUpdateErr);

								// Set assertions
								(gateProcessTemplateUpdateRes.body._id).should.equal(gateProcessTemplateSaveRes.body._id);
								(gateProcessTemplateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate process templates if not signed in', function(done) {
		// Create new Gate process template model instance
		var gateProcessTemplateObj = new GateProcessTemplate(gateProcessTemplate);

		// Save the Gate process template
		gateProcessTemplateObj.save(function() {
			// Request Gate process templates
			request(app).get('/gate-process-templates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate process template if not signed in', function(done) {
		// Create new Gate process template model instance
		var gateProcessTemplateObj = new GateProcessTemplate(gateProcessTemplate);

		// Save the Gate process template
		gateProcessTemplateObj.save(function() {
			request(app).get('/gate-process-templates/' + gateProcessTemplateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateProcessTemplate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate process template instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process template
				agent.post('/gate-process-templates')
					.send(gateProcessTemplate)
					.expect(200)
					.end(function(gateProcessTemplateSaveErr, gateProcessTemplateSaveRes) {
						// Handle Gate process template save error
						if (gateProcessTemplateSaveErr) done(gateProcessTemplateSaveErr);

						// Delete existing Gate process template
						agent.delete('/gate-process-templates/' + gateProcessTemplateSaveRes.body._id)
							.send(gateProcessTemplate)
							.expect(200)
							.end(function(gateProcessTemplateDeleteErr, gateProcessTemplateDeleteRes) {
								// Handle Gate process template error error
								if (gateProcessTemplateDeleteErr) done(gateProcessTemplateDeleteErr);

								// Set assertions
								(gateProcessTemplateDeleteRes.body._id).should.equal(gateProcessTemplateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate process template instance if not signed in', function(done) {
		// Set Gate process template user 
		gateProcessTemplate.user = user;

		// Create new Gate process template model instance
		var gateProcessTemplateObj = new GateProcessTemplate(gateProcessTemplate);

		// Save the Gate process template
		gateProcessTemplateObj.save(function() {
			// Try deleting Gate process template
			request(app).delete('/gate-process-templates/' + gateProcessTemplateObj._id)
			.expect(401)
			.end(function(gateProcessTemplateDeleteErr, gateProcessTemplateDeleteRes) {
				// Set message assertion
				(gateProcessTemplateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate process template error error
				done(gateProcessTemplateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateProcessTemplate.remove().exec();
		done();
	});
});