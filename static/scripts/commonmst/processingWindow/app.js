var objProcessingWindowView = null;
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
	appFolder : 'static/scripts/commonmst/processingWindow/app',
	requires : ['GCP.view.ProcessingWindowView'],
	controllers : ['GCP.controller.ProcessingWindowController'],
	launch : function() {
		objProcessingWindowView = Ext.create('GCP.view.ProcessingWindowView', {
					renderTo : 'processingWindowDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProcessingWindowView)) {
		objProcessingWindowView.hide();
		objProcessingWindowView.show();
	}
}
