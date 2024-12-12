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
	name : 'ENC',
	appFolder : 'static/scripts/tpfa/endClient/app',
	requires : ['ENC.view.EndClientPersonDetailView'],
	controllers : ['ENC.controller.PersonDetailController'],
	launch : function() {
		objSummaryView = Ext.create('ENC.view.EndClientPersonDetailView', {
			renderTo : 'personDetailViewDiv'
		});
	}
});

function resizeContentPanel() {
		objSummaryView.hide();
		objSummaryView.show();
}