/*global RolesApp */

(function () {
	'use strict';

	var RolesStore = {
		all: [],
		visible: [],
		flag: null,

		createId: (function () {
			// Creates a unique ID.
			var s4 = function () {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			};

			return function () {
				return s4() + s4();
			};
		})(),
		fetchRoleDetails: function (e, flag) {
			// Called from each route's instantiation.
			 
			RolesApp.trigger('launch');
 
		}
	};

	RolesApp.bind('readRoleDetails', RolesStore.fetchRoleDetails);
})();
