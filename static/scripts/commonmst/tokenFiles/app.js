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
	appFolder : 'static/scripts/commonmst/tokenFiles/app',
	requires : ['GCP.view.TokenFilesView','Ext.util.Point'],
	controllers : ['GCP.controller.TokenFilesController'],
	launch : function() {
		objTokenView = Ext.create('GCP.view.TokenFilesView', {
					renderTo : 'tokenFilesDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objTokenView)) {
		objTokenView.hide();
		objTokenView.show();
	}
}
