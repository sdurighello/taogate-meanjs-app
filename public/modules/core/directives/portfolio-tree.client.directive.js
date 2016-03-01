'use strict';

angular.module('core').directive('portfolioTree', [
	function() {
		return {
			restrict: 'EA',
			scope: { portfolios:'=portfolios', portfolioTrees:'=portfolioTrees', selectPortfolio:'=selectPortfolio' },
			templateUrl:'modules/core/directives/portfolio-tree.client.directive.html'
		};
	}
]);
