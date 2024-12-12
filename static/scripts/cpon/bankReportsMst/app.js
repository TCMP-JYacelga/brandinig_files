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
	appFolder : 'static/scripts/cpon/bankReportsMst/app',
	requires : ['GCP.view.BankReportView'],
	controllers : ['GCP.controller.BankReportController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.BankReportView', {
					renderTo : 'bankReportDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
