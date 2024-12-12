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
	appFolder : 'static/scripts/commonmst/bankPrinterMst/app',
	requires : ['GCP.view.BankPrinterMstView'],
	controllers : ['GCP.controller.BankPrinterMstController'],
	launch : function() {
		objMasterView = Ext.create('GCP.view.BankPrinterMstView', {
			renderTo : 'bankPrinterMstDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objMasterView)) {
		objMasterView.hide();
		objMasterView.show();
	}
}
