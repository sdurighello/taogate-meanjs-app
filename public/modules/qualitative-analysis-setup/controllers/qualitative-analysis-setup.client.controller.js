'use strict';

angular.module('qualitative-analysis-setup').controller('QualitativeAnalysisSetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'QualitativeImpactScores', 'QualitativeImpactGroups', 'QualitativeImpacts', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, QualitativeImpactScores, QualitativeImpactGroups, QualitativeImpacts, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

            QualitativeImpacts.query(function(impacts){
                $scope.impacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            QualitativeImpactGroups.query(function(groups){
                $scope.impactGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            QualitativeImpactScores.query(function(scores){
                $scope.impactScores = scores;
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
			QualitativeImpactScores.query(function(scores){
				$scope.impactScores = scores;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalScore;
		$scope.selectScore = function(score){
			$scope.error = null;
			$scope.selectScoreForm('view');
			$scope.impactScore = score;
			originalScore = _.clone(score);
		};

		$scope.updateScore = function(score) {
			$scope.error = null;
			score.$update(function(response) {
                $scope.impactScores = _.sortBy($scope.impactScores,'numericalValue');
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
				$scope.impactScore = null;
				$scope.findScores();
				$scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createScore = function() {
			$scope.error = null;
			var impactScore = new QualitativeImpactScores ({
				name: 'New impact score',
				numericalValue: 0
			});
			impactScore.$save(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ---------------------------------------------------- GROUPS & IMPACTS --------------------------------------

        // ------------------- CALCULATE WEIGHTS -------------

        $scope.getTotalGroupWeights = function(groups){
            if(groups){
                return _.reduce(groups, function(memo, group){
                    return memo + group.weight;
                }, 0);
            }
        };

        $scope.getTotalImpactWeights = function(group){
            if(group){
                return _.reduce(group.impacts, function(memo, impact){
                    return memo + impact.weight;
                }, 0);
            }
        };

		// ------------------- NG-SWITCH ---------------------

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchImpactForm = {};

		$scope.selectImpactForm = function(impact, string){
			if(string === 'view'){ $scope.switchImpactForm[impact._id] = 'view';}
			if(string === 'edit'){$scope.switchImpactForm[impact._id] = 'edit';}
		};

		// ----------------- REFRESH GROUP LIST ------------

		$scope.groupList = function(){
            $scope.initError = [];
			QualitativeImpactGroups.query(function(groups){
				$scope.impactGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE GROUP ----------------

		$scope.createGroup = function() {
			$scope.error = null;

			var impactGroup = new QualitativeImpactGroups ({
				name: 'New impact group',
				description: 'new group description',
                weight: 0,
				impacts: []
			});

			impactGroup.$save(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditGroup = {};

        $scope.selectGroup = function(group){
			originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(group) {
			group.$update(function(response) {
                $scope.selectGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
            group.weight = originalEditGroup[group._id].weight;
			group.description = originalEditGroup[group._id].description;
			$scope.selectGroupForm(group, 'view');
		};

		// ------------------- REMOVE GROUP -----------------

		$scope.removeGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------ CREATE IMPACT ----------------

		$scope.createImpact = function(group) {
			$scope.error = null;

			var impact = new QualitativeImpacts ({
				name: 'New impact',
                weight: 0,
				description: ''
			});

			impact.$save({groupId: group._id}, function(res) {
				// Add new priority to the view group
				group.impacts.push(res);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT IMPACT -----------------

		var originalEditImpact = {};

		$scope.selectEditImpact = function(group, impact){
			originalEditImpact[impact._id] = _.clone(impact);
			$scope.selectImpactForm(impact, 'edit');
		};

		$scope.updateImpact = function(group, impact) {
			QualitativeImpacts.update(impact, function(response) {
				$scope.selectImpactForm(impact, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditImpact = function(impact){
			$scope.error = null;
			impact.name = originalEditImpact[impact._id].name;
            impact.weight = originalEditImpact[impact._id].weight;
			impact.description = originalEditImpact[impact._id].description;
			$scope.selectImpactForm(impact, 'view');
		};

		// ------------------- REMOVE IMPACT -----------------

		$scope.removeImpact = function(group, impact) {
			$scope.error = null;

            QualitativeImpacts.remove({groupId: group._id}, impact, function(res){
                group.impacts = _.without(group.impacts, impact);
            }, function(err){
                $scope.error = err.data.message;
            });

		};
	}
]);
