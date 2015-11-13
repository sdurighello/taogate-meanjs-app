'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');

		// taoPortfolio.com additions for menu
		this.addMenuItem('topbar','My taoPortfolio','mytao','item','mytao',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],0);
		this.addMenuItem('topbar','Admin','admin','dropdown','admin',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],1);

		// Setup
		this.addMenuItem('topbar','Setup','setup','dropdown','setup',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],2);
			// Portfolio Definition
		this.addSubMenuItem('topbar', 'setup', 'Portfolio definition', 'menuTitle','menuTitle',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],0);
                // Strategy nodes
        this.addSubMenuItem('topbar', 'setup', 'Strategy nodes', 'strategy-node-setup','strategy-node-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],1);
				// Portfolios
		this.addSubMenuItem('topbar', 'setup', 'Portfolios', 'portfolio-setup','portfolio-setup',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],2);
				// Stakeholders
		this.addSubMenuItem('topbar', 'setup', 'Stakeholders', 'people-setup','people-setup',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],3);
				// Priorities
		this.addSubMenuItem('topbar', 'setup', 'Priorities', 'priority-setup','priority-setup',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],4);
				// Categories
		this.addSubMenuItem('topbar', 'setup', 'Categories', 'category-setup','category-setup',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],5);
                // Dependencies
        this.addSubMenuItem('topbar', 'setup', 'Dependencies', 'dependency-setup','dependency-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],6);
			// Portfolio Evaluation
		this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],7);
		this.addSubMenuItem('topbar', 'setup', 'Portfolio evaluation', 'menuTitle','menuTitle',false,
			['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],8);
                // Financial analysis
        this.addSubMenuItem('topbar', 'setup', 'Financial analysis', 'financial-analysis-setup','financial-analysis-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],9);
                // Qualitative analysis
        this.addSubMenuItem('topbar', 'setup', 'Qualitative analysis', 'qualitative-analysis-setup','qualitative-analysis-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],10);
                // Risk analysis
        this.addSubMenuItem('topbar', 'setup', 'Risk analysis', 'risk-analysis-setup','risk-analysis-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],11);
        // Portfolio Delivery
        this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],12);
        this.addSubMenuItem('topbar', 'setup', 'Portfolio delivery', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],13);
            // Gate Process
        this.addSubMenuItem('topbar', 'setup', 'Gate process', 'gate-management-setup','gate-management-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],14);
            // Gate Review
        this.addSubMenuItem('topbar', 'setup', 'Gate review', 'gate-review-setup','gate-review-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],15);
            // Delivery logs
        this.addSubMenuItem('topbar', 'setup', 'Delivery logs', 'log-general-setup','log-general-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],16);
            // Issues & Changes
        this.addSubMenuItem('topbar', 'setup', 'Issues & Changes', 'log-delivery-setup','log-delivery-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],17);
            // Milestone log
        this.addSubMenuItem('topbar', 'setup', 'Milestones', 'log-milestone-setup','log-milestone-setup',false,
            ['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],18);



		this.addMenuItem('topbar','Definition','definition','dropdown','definition',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],3);
		this.addMenuItem('topbar','Evaluation','evaluation','dropdown','evaluation',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],4);
		this.addMenuItem('topbar','Delivery','delivery','dropdown','delivery',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],5);
		this.addMenuItem('topbar','Dashboards','dashboards','dropdown','dashboards',false,['superAdmin','admin','PMO','projectManager','portfolioManager','executive'],6);
	}
]);
