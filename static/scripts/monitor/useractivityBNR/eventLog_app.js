var objEventLogView = null;
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
	appFolder : 'static/scripts/monitor/useractivityBNR/app',
	//appFolder : 'app',
	requires : ['GCP.view.eventLog.EventLogView','Ext.ux.gcp.vtypes.CustomVTypes'],
	controllers : ['GCP.controller.EventLogController','GCP.controller.DateHandler'],
	init : function(application) {
		Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
		prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		prefHandler.init(application);
	},
	launch : function() {
		objEventLogView = Ext.create('GCP.view.eventLog.EventLogView', {
					renderTo : 'eventLogDiv'
				});
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objEventLogView)) {
		objEventLogView.hide();
		objEventLogView.show();
		var filterButton=objEventLogView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	