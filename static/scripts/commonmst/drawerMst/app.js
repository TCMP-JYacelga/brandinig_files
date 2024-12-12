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
	appFolder : 'static/scripts/commonmst/drawerMst/app',
	requires : ['GCP.view.DrawerSetupView'],
	controllers : ['GCP.controller.DrawerSetupController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.DrawerSetupView', {
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
