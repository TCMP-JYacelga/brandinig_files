var objreportCenterNewUXView = null;
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
			appFolder : 'static/scripts/reports/reportCenterT7/app',
			requires : ['Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.GroupView', 'GCP.view.ReportCenterView'],
			controllers : ['GCP.controller.ReportCenterController'],
			init : function(application) {
				//Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								// window.location='logoutUser.action';
								location.reload();
							}
						});
				objreportCenterNewUXView = Ext.create('GCP.view.ReportCenterView', {
							renderTo : 'reportCenterNewUXDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objreportCenterNewUXView)) {
		objreportCenterNewUXView.hide();
		objreportCenterNewUXView.show();
		var filterButton=objreportCenterNewUXView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	