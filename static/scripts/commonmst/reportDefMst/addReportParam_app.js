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
	appFolder : 'static/scripts/commonmst/reportDefMst/app',
	requires : ['GCP.view.ReportParameterView'],
	controllers : ['GCP.controller.ReportParameterController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.ReportParameterView', {
					renderTo : 'reportParamDetails'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
