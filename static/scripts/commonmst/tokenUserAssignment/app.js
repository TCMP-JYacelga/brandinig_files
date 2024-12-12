var objTokenView = null;
Ext.Loader.setConfig({
			enabled : true,
			disableCaching : false,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/tokenUserAssignment/app',
	requires : ['GCP.view.UserTokenAssignmentView'],
	controllers : ['GCP.controller.UserTokenAssignmentController'],
	launch : function() {
		objTokenView = Ext.create('GCP.view.UserTokenAssignmentView', {
					renderTo : 'tokenAssignmentDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objTokenView)) {
		objTokenView.hide();
		objTokenView.show();
	}
}
