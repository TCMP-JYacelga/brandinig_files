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
	appFolder : 'static/scripts/reports/reportCenter/app',
	//appFolder : 'app',
	requires : ['GCP.view.ReportCenterView'],
	controllers : ['GCP.controller.ReportCenterController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.ReportCenterView', {
					renderTo : 'reportCenterDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
