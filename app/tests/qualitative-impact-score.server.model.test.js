'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QualitativeImpactScore = mongoose.model('QualitativeImpactScore');

/**
 * Globals
 */
var user, qualitativeImpactScore;

/**
 * Unit tests
 */
describe('Qualitative impact score Model Unit Tests:', function() {
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
			qualitativeImpactScore = new QualitativeImpactScore({
				name: 'Qualitative impact score Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return qualitativeImpactScore.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			qualitativeImpactScore.name = '';

			return qualitativeImpactScore.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		QualitativeImpactScore.remove().exec();
		User.remove().exec();

		done();
	});
});