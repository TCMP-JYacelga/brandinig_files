var objEndClientDocumentView = null;
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
	requires : ['GCP.view.EndClientDocumentView'],
	controllers : ['GCP.controller.EndClientDocumentController'],
	launch : function() {
		objEndClientDocumentView = Ext.create('GCP.view.EndClientDocumentView', {
			renderTo : 'endClientDocumentDiv'
		});
		
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objEndClientDocumentView)) {
		objEndClientDocumentView.hide();
		objEndClientDocumentView.show();
	}
}