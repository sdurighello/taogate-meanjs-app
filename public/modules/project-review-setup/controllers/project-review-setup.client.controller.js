'use strict';

angular.module('project-review-setup').controller('ProjectReviewSetupController', ['$scope', '$stateParams', '$location', 'Authentication',
	'ProjectReviewScores','ProjectReviewTypes','PortfolioReviewTypes', '$q', '_',
	function($scope, $stateParams, $location, Authentication, ProjectReviewScores, ProjectReviewTypes, PortfolioReviewTypes, $q, _) {

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

            ProjectReviewScores.query(function(scores){
				$scope.reviewScores = scores;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            ProjectReviewTypes.query(function(res){
                $scope.projectReviewTypes = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            PortfolioReviewTypes.query(function(res){
                $scope.portfolioReviewTypes = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};

		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			$scope.userHasAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo';
			});
		});


// ---------------------------------------------------- IMPACT SCORES --------------------------------------


		// ------------------- NG-SWITCH ---------------------

		$scope.selectScoreForm = function(string){
			if(string === 'view'){ $scope.switchScoreForm = 'view';}
			if(string === 'edit'){$scope.switchScoreForm = 'edit';}
		};

		// ------------------- LIST OF SCORES -----------------

		$scope.findScores = function() {
			$scope.initError = [];
			ProjectReviewScores.query(function(scores){
				$scope.reviewScores = scores;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalScore;
		$scope.selectScore = function(score){
			$scope.error = null;
			$scope.selectScoreForm('view');
			$scope.reviewScore = score;
			originalScore = _.clone(score);
		};

		$scope.updateScore = function(score) {
			$scope.error = null;
			score.$update(function(response) {
				$scope.reviewScores = _.sortBy($scope.reviewScores,'numericalValue');
				$scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditScore = function(score){
			score.name = originalScore.name;
			score.numericalValue = originalScore.numericalValue;
			score.description = originalScore.description;
			$scope.selectScoreForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeScore = function(score) {
			$scope.error = null;
			score.$remove(function(response) {
				$scope.reviewScore = null;
				$scope.findScores();
				$scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createScore = function() {
			$scope.error = null;
			var reviewScore = new ProjectReviewScores ({
				name: 'New review score',
				numericalValue: 0
			});
			reviewScore.$save(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ----------------------------------------------- PORTFOLIO REVIEW TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioTypeForm = {};

		$scope.selectPortfolioTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchPortfolioTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchPortfolioTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchPortfolioTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findPortfolioTypes = function() {
			$scope.initError = [];
			PortfolioReviewTypes.query(function(types){
				$scope.portfolioReviewTypes = _.clone(types);
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		$scope.selectPortfolioType = function(type){
			$scope.selectPortfolioTypeForm(type, 'edit');
		};

		$scope.updatePortfolioType = function(type) {
			type.$update(function(response) {
				$scope.findPortfolioTypes();
				$scope.selectPortfolioTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPortfolioType = function(type){
			$scope.findPortfolioTypes();
			$scope.selectPortfolioTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removePortfolioType = function(type) {
			type.$remove(function(response) {
				$scope.findPortfolioTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createPortfolioType = function() {
			var portfolioType = new PortfolioReviewTypes ({
				name: 'New portfolio review type'
			});
			portfolioType.$save(function(response) {
				$scope.findPortfolioTypes();
				$scope.selectPortfolioTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // ----------------------------------------------- PROJECT REVIEW TYPES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchProjectTypeForm = {};

        $scope.selectProjectTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchProjectTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchProjectTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchProjectTypeForm[type._id] = 'edit';}
        };

        // ------------------- LIST OF TYPES -----------------

        $scope.findProjectTypes = function() {
            $scope.initError = [];
            ProjectReviewTypes.query(function(types){
                $scope.projectReviewTypes = _.clone(types);
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        $scope.selectProjectType = function(type){
            $scope.selectProjectTypeForm(type, 'edit');
        };

        $scope.updateProjectType = function(type) {
            type.$update(function(response) {
                $scope.findProjectTypes();
                $scope.selectProjectTypeForm(type, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditProjectType = function(type){
            $scope.findProjectTypes();
            $scope.selectProjectTypeForm(type, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeProjectType = function(type) {
            type.$remove(function(response) {
                $scope.findProjectTypes();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createProjectType = function() {
            var projectType = new ProjectReviewTypes ({
                name: 'New project review type'
            });
            projectType.$save(function(response) {
                $scope.findProjectTypes();
                $scope.selectProjectTypeForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);
