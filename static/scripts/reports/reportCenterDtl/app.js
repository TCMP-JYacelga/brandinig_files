var objReportCenterDtlView = null;
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
	appFolder : 'static/scripts/reports/reportCenterDtl/app',
	//appFolder : 'app',
	requires : ['GCP.view.ReportCenterDtlView','Ext.ux.gcp.SmartGridActionBar', 'Ext.ux.gcp.GCPPager'],
	controllers : ['GCP.controller.ReportCenterDtlController'],
	launch : function() {
		objReportCenterDtlView = Ext.create('GCP.view.ReportCenterDtlView', {
					renderTo : 'reportCenterDtlDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objReportCenterDtlView)) {
		objReportCenterDtlView.hide();
		objReportCenterDtlView.show();
	}
}