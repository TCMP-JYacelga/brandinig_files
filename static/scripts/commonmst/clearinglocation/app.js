var objMasterView = null;
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
	appFolder : 'static/scripts/commonmst/clearinglocation/app',
	requires : ['GCP.view.ClearingLocationView'],
	controllers : ['GCP.controller.ClearingLocationController'],
	launch : function() {
		objMasterView = Ext.create('GCP.view.ClearingLocationView', {
			renderTo : 'clearingLocationDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objMasterView)) {
		objMasterView.hide();
		objMasterView.show();
	}
}
