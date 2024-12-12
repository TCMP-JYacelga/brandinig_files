var objSummaryView = null;

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
	appFolder : 'static/scripts/tpfa/endClientDocument/app',
	requires : ['GCP.view.EndClientVerifyDocumentView'],
	controllers : ['GCP.controller.EndClientViewDocumentController'],
	launch : function() {
		objSummaryView = Ext.create('GCP.view.EndClientVerifyDocumentView', {
			renderTo : 'endClientDocumentViewDiv'
		});
	}
});

function resizeContentPanel() {
		objSummaryView.hide();
		objSummaryView.show();
}