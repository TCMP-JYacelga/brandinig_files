/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var UserEntry = {
		elem : {
			usersApp : '#ft-layout-container',
			assetPanel : '#assetPanel',
			footer : '#footer'
		},

		render : function () {
			console.log(" rendering UserEntry ");
			var tags = window.location.hash.replace(/^#/, '').split('#');
			var viewName = "static/UsersApp/templates/" + tags[0].substr(1) + ".hbs";
			if ("static/UsersApp/templates/UserEntry.hbs" === viewName) {
				viewName = "static/UsersApp/templates/BalanceReporting.hbs";
			}
			var userAppPanel = $(UserEntry.elem.usersApp);
			var assetPanel = $(UserEntry.elem.assetPanel);
			// If the quick menu is already rendered render only the assetPanel
			
				
				this.render('static/UsersApp/templates/UserEntry.hbs', '', '', {
					UserTitle : 'static/UsersApp/templates/UserTitle.hbs',
					UserEntryQuickLinks : 'static/UsersApp/templates/UserEntryQuickLinks.hbs',
					AssetPanel : "static/UsersApp/templates/BalanceReporting.hbs",
				}).then(function () {
					console.log(" Rendering full page");
					userAppPanel.html(this.content);
				});
			

		}
	};

	UsersApp.bind('renderUserEntry', UserEntry.render);

})(jQuery);
