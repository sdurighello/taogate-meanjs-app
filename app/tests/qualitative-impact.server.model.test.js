'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QualitativeImpact = mongoose.model('QualitativeImpact');

/**
 * Globals
 */
var user, qualitativeImpact;

/**
 * Unit tests
 */
describe('Qualitative impact Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			qualitativeImpact = new QualitativeImpact({
				name: 'Qualitative impact Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return qualitativeImpact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			qualitativeImpact.name = '';

			return qualitativeImpact.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		QualitativeImpact.remove().exec();
		User.remove().exec();

		done();
	});
});