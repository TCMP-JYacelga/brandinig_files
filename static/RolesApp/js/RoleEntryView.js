/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var RoleEntry = {
		elem : {
			rolesapp : '#ft-layout-container',
			assetPanel : '#assetPanel',
			footer : '#footer'
		},

		render : function () {
			console.log(" rendering RoleEntry ");
			var tags = window.location.hash.replace(/^#/, '').split('#');
			var viewName = "templates/" + tags[0].substr(1) + ".hbs";
			if ("templates/RoleEntry.hbs" === viewName) {
				viewName = "templates/Admin.hbs";
			}
			var roleAppPanel = $(RoleEntry.elem.rolesapp);
			var assetPanel = $(RoleEntry.elem.assetPanel);
			// If the quick menu is already rendered render only the assetPanel
			if ($('#MENUITEM_ADMIN').length == 0) {
				
				this.render('templates/RoleEntry.hbs', '', '', {
					RoleTitle : 'templates/RoleTitle.hbs',
					RoleEntryQuickLinks : 'templates/RoleEntryQuickLinks.hbs',
					AssetPanel : viewName
				}).then(function () {
					console.log(" Rendering full page");
					roleAppPanel.html(this.content);
				});
			} else {

				this.render(viewName).then(function () {
					console.log(" Rendering asset Page");
					assetPanel.html(this.content);
				});

			}

		}
	};

	RolesApp.bind('renderRoleEntry', RoleEntry.render);

})(jQuery);
