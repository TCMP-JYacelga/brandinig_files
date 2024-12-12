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
	appFolder : 'static/scripts/cpon/alertSubscriptionMst/app',
	requires : ['GCP.view.AlertSetupView'],
	controllers : ['GCP.controller.AlertSetupController'],
	launch : function() {
		Ext.create('GCP.view.AlertSetupTitleView', {
			renderTo : 'PageTitle',
			width : '100%'
		});
		objProfileView = Ext.create('GCP.view.AlertSetupView', {
					renderTo : 'alertSubscriptionDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
