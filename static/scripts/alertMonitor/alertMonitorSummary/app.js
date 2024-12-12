var objProfileView = null;
var objAlertMonitorView = null;
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
	appFolder : 'static/scripts/alertMonitor/alertMonitorSummary/app',
	//appFolder : 'app',
	requires : ['GCP.view.AlertMonitorView','Ext.ux.gcp.vtypes.CustomVTypes'],
	controllers : ['GCP.controller.AlertMonitorController','GCP.controller.DateHandler'],
	init : function(application) {
		Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
		prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		prefHandler.init(application);
	},
	launch : function() {
		objAlertMonitorView = Ext.create('GCP.view.AlertMonitorView', {
					renderTo : 'alertMonitorDiv'
				});
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objAlertMonitorView)) {
		objAlertMonitorView.hide();
		objAlertMonitorView.show();
		var filterButton=objAlertMonitorView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	
