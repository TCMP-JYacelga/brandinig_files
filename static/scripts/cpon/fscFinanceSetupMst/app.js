var objProfileView = null;
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
	appFolder : 'static/scripts/cpon/fscFinanceSetupMst/app',
	requires : ['GCP.view.FinanceSetupView'],
	controllers : ['GCP.controller.FscFinanceSetupController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.FinanceSetupView', {
					renderTo : 'fscFinanceSetupDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
