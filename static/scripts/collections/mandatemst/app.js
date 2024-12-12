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
	appFolder : 'static/scripts/collections/mandatemst/app',
	requires : ['GCP.view.MandateSetupView'],
	controllers : ['GCP.controller.MandateSetupController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.MandateSetupView', {
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
