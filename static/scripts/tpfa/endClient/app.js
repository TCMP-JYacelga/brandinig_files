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
	name : 'GCPA',
	appFolder : 'static/scripts/tpfa/endClient/app',
	requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.GroupView', 'GCPA.view.EndClientView'],
	controllers : ['GCPA.controller.EndClientController'],
	launch : function() {
		objSummaryView = Ext.create('GCPA.view.EndClientView', {
			renderTo : 'endClientViewSummaryDiv'
		});
	}
});