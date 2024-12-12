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
	appFolder : 'static/scripts/commonmst/contractRateMst/app',
	requires : ['GCP.view.ContractSetupView'],
	controllers : ['GCP.controller.ContractSetupController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.ContractSetupView', {
					renderTo : 'contractRateDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
