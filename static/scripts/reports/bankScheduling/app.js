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
	appFolder : 'static/scripts/reports/bankScheduling/app',
	//appFolder : 'app',
	requires : ['GCP.view.BankScheduleView'],
	controllers : ['GCP.controller.BankScheduleController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.BankScheduleView', {
					renderTo : 'bankScheduleDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
