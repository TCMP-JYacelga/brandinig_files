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
	appFolder : 'static/scripts/commonmst/creditLineMst/app',
	requires : ['GCP.view.CreditLineMstView'],
	controllers : ['GCP.controller.CreditLineMstController'],
	launch : function() {
		objMasterView = Ext.create('GCP.view.CreditLineMstView', {
			renderTo : 'creditLineMstDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objMasterView)) {
		objMasterView.hide();
		objMasterView.show();
	}
}
