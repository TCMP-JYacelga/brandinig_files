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
	appFolder : 'static/scripts/interfacing/summary',
	//appFolder : 'app',
	requires : ['GCP.view.UploadSummaryView'],
	controllers : ['GCP.controller.UploadSummaryController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.UploadSummaryView', {
					renderTo : 'UploadSummaryDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
