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
	appFolder : 'static/scripts/commonmst/dispBankProdClrLoc/app',
	requires : ['GCP.view.DispBankProdClrLocView'],
	controllers : ['GCP.controller.DispBankProdClrLocController'],
	launch : function() {
		objMasterView = Ext.create('GCP.view.DispBankProdClrLocView', {
			renderTo : 'dbpclListDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objMasterView)) {
		objMasterView.hide();
		objMasterView.show();
	}
}
