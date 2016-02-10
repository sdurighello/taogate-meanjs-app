'use strict';

angular.module('portfolio-review-templates').controller('PortfolioReviewTemplatesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'PortfolioReviewTemplates', 'PortfolioReviewTypes', 'PeoplePortfolioGroups', '$q','_',
	function($scope, $stateParams, $location, Authentication, PortfolioReviewTemplates, PortfolioReviewTypes, PeoplePortfolioGroups, $q, _) {

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

			PortfolioReviewTemplates.query(function (res) {
				$scope.templates = res;
			}, function (err) {
				$scope.initError.push(err.data.message);
			});

			PortfolioReviewTypes.query(function (res) {
				$scope.templateTypes = res;
			}, function (err) {
				$scope.initError.push(err.data.message);
			});

			PeoplePortfolioGroups.query(function (res) {
				$scope.stakeholderGroups = res;
			}, function (err) {
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

		// ------------------- NG-SWITCH ---------------------

		$scope.switchTemplateForm = {};

		$scope.selectTemplateForm = function(template, string){
			if(string === 'view'){ $scope.switchTemplateForm[template._id] = 'view';}
			if(string === 'edit'){$scope.switchTemplateForm[template._id] = 'edit';}
		};

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchItemForm = {};

		$scope.selectItemForm = function(item, string){
			if(string === 'view'){ $scope.switchItemForm[item._id] = 'view';}
			if(string === 'edit'){$scope.switchItemForm[item._id] = 'edit';}
		};

		// ----------------- REFRESH TEMPLATE LIST ------------

		$scope.templateList = function(){
			PortfolioReviewTemplates.query(function(templates){
				$scope.templates = templates;
			});
		};


		// ------------------- CALCULATE WEIGHTS -------------

		$scope.getTotalTemplateWeights = function(template){
			if(template){
				return _.reduce(template.groups, function(memo, group){
					return memo + group.weight;
				}, 0);
			}
		};

		$scope.getTotalItemWeights = function(group){
			if(group){
				return _.reduce(group.items, function(memo, impact){
					return memo + impact.weight;
				}, 0);
			}
		};



		// ------------------ CREATE TEMPLATE ----------------

		$scope.newTemplate = {};

		$scope.showNewTemplateForm = false;

		$scope.saveNewTemplate = function(newTemplate) {
			$scope.error = null;
			var template = new PortfolioReviewTemplates ({
				name: newTemplate.name,
				type: newTemplate.type,
				groups : []
			});
			template.$save(function(res) {
				$scope.error = null;
				$scope.newTemplate = {};
				$scope.showNewTemplateForm = false;
				$scope.templateList();
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewTemplate = function(){
			$scope.error = null;
			$scope.newTemplate = {};
			$scope.showNewTemplateForm = false;
		};

		// ------------------- EDIT TEMPLATE (HEADER ONLY) -----------------

		var originalEditTemplate = {};

		$scope.selectTemplate = function(template){
			originalEditTemplate = _.clone(template);
			$scope.selectedTemplate = template;
		};

		$scope.updateTemplate = function(template) {
			PortfolioReviewTemplates.update({
				_id: template._id,
				name: template.name,
				type : template.type,
				description: template.description
			}, function(template){
				$scope.error = null;
				$scope.selectTemplateForm(template, 'view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditTemplate = function(template){
			$scope.error = null;
			$scope.selectedTemplate.name = originalEditTemplate.name;
			$scope.selectedTemplate.description = originalEditTemplate.description;
			$scope.selectedTemplate.type = originalEditTemplate.type;
			$scope.selectTemplateForm(template, 'view');
		};


		// ------------------ CREATE REVIEW GROUP ----------------

		$scope.createGroup = function(template) {
			var newGroup = {
				name : 'New group',
				weight : 0,
				peopleGroups : [],
				items : []
			};
			PortfolioReviewTemplates.createGroup(
				{
					portfolioReviewTemplateId: template._id
				}, newGroup,
				function (res) {
					$scope.error = null;
					template.groups.push(res);
				},
				function (err) {
					console.log(err.data.message);
					$scope.error = err.data.message;
				}
			);
		};


		// ------------------- EDIT GROUP (HEADER ONLY) -----------------

		var originalEditGroup = {};
		$scope.selectedStakeholderGroup = {};

		$scope.selectGroup = function(group){
			$scope.selectedStakeholderGroup[group._id] = null;
			originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(template, group) {
			PortfolioReviewTemplates.updateGroup({
				portfolioReviewTemplateId : template._id,
				groupId : group._id
			}, group, function(res){
				$scope.error = null;
				$scope.selectGroupForm(res, 'view');
			},function(err){
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
			group.description = originalEditGroup[group._id].description;
			group.weight = originalEditGroup[group._id].weight;
			$scope.selectGroupForm(group, 'view');
		};



		// ----- ADD/REMOVE STAKEHOLDER GROUPS ----



		$scope.getAllowedStakeholderGroups = function(reviewGroup){
			return _.filter($scope.stakeholderGroups, function(stakeholderGroup){
				return !_.find(reviewGroup.peopleGroups, function(sGroup){
					return sGroup._id === stakeholderGroup._id;
				});
			});
		};

		$scope.stringForAllowedStakeholderGroups = 'No selectable groups';

		$scope.addStakeholderGroup = function(template, group, stakeholderGroup){
			$scope.selectedStakeholderGroup[group._id] = null;
			PortfolioReviewTemplates.addStakeholderGroup(
				{
					portfolioReviewTemplateId : template._id,
					groupId : group._id,
					peopleGroupId : stakeholderGroup._id
				}, stakeholderGroup,
				function (res) {
					$scope.error = null;
					group.peopleGroups.push(stakeholderGroup);
				},
				function (err) {
					$scope.error = err.data.message;
				}
			);
		};

		$scope.removeStakeholderGroup = function(template, group, stakeholderGroup){
			$scope.selectedStakeholderGroup[group._id] = null;
			PortfolioReviewTemplates.removeStakeholderGroup(
				{
					portfolioReviewTemplateId : template._id,
					groupId : group._id,
					peopleGroupId : stakeholderGroup._id
				}, stakeholderGroup,
				function (res) {
					$scope.error = null;
					group.peopleGroups = _.without(group.peopleGroups, stakeholderGroup);
				},
				function (err) {
					$scope.error = err.data.message;
				}
			);
		};



		// ------------------ CREATE ITEM ----------------

		$scope.createItem = function(template, group) {
			$scope.error = null;
			var newItem = {
				name: 'New review item',
				weight: 0,
				peopleReviews : []
			};

			PortfolioReviewTemplates.createItem(
				{
					portfolioReviewTemplateId : template._id,
					groupId : group._id
				}, newItem,
				function (res) {
					group.items.push(res);
				},
				function (err) {
					$scope.error = err.data.message;
				}
			);
		};

		// ------------------- EDIT ITEM (Header) -----------------

		var originalEditItem = {};

		$scope.selectEditItem = function(group, item){
			originalEditItem[item._id] = _.clone(item);
			$scope.selectItemForm(item, 'edit');
		};

		$scope.updateItem = function(template, group, item) {
			PortfolioReviewTemplates.updateItem({
				portfolioReviewTemplateId : template._id,
				groupId : group._id,
				itemId : item._id
			}, item, function(res){
				$scope.selectItemForm(item, 'view');
			},function(err){
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditItem = function(item){
			$scope.error = null;
			item.name = originalEditItem[item._id].name;
			item.description = originalEditItem[item._id].description;
			item.weight = originalEditItem[item._id].weight;
			$scope.selectItemForm(item, 'view');
		};


		// ------------------- DELETE TEMPLATE -----------------

		$scope.removeTemplate = function(template) {
			$scope.error = null;
			template.$remove(function(response) {
				$scope.selectedTemplate = null;
				$scope.templateList();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------- DELETE GROUP -----------------

		$scope.removeGroup = function(template, group) {
			$scope.error = null;

			PortfolioReviewTemplates.deleteGroup({
				portfolioReviewTemplateId : template._id,
				groupId : group._id
			}, group, function(res){
				template.groups = _.without(template.groups, group);
			}, function(err){
				$scope.error = err.data.message;
			});
		};


		// ------------------- DELETE ITEM -----------------

		$scope.removeItem = function(template, group, item) {
			$scope.error = null;
			PortfolioReviewTemplates.deleteItem({
				portfolioReviewTemplateId : template._id,
				groupId : group._id,
				itemId : item._id
			}, item, function(res){
				group.items = _.without(group.items, item);
			}, function(err){
				$scope.error = err.data.message;
			});
		};



	}
]);
