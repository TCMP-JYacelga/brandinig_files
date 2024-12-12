var objSummaryView = null, prefHandler = null;
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
			appFolder : 'static/scripts/fsc/PurchaseOrder/app',
			requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.data.PagingMemoryProxy',
					'Ext.ux.gcp.GroupView', 'GCP.view.POSummaryView',
					'Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.POSummaryController'],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
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
				objSummaryView = Ext.create('GCP.view.POSummaryView', {
							renderTo : 'summary-T7-content'
						});
			}
		});


function resizeContentPanel() {
	if (!Ext.isEmpty(objSummaryView)) {
		objSummaryView.hide();
		objSummaryView.show();
		var filterButton=objSummaryView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});		
