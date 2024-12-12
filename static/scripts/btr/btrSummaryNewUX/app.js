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
			appFolder : 'static/scripts/btr/btrSummaryNewUX/app',
			requires : ['GCP.view.AccountCenter',
					'Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['AccountSummaryController',
					'AccountActivityController','AccountBalancesController','TransactionInitiationController',
					'BtrCommonController'],
			launch : function() {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								location.reload();
							}
						});
				objSummaryView = Ext.create('GCP.view.AccountCenter', {
							renderTo : 'summaryDiv'
							//width : '99%'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objSummaryView)) {
		objSummaryView.hide();
		if(!Ext.isEmpty(accountGraphView))
			accountGraphView.doLayout();
		objSummaryView.show();
		if (!Ext.isEmpty(objFilterPanelView)) {
			var filterButton = objFilterPanelView.down('button[itemId="filterButton"]');
			if(!Ext.isEmpty(filterButton) && filterButton.panel)
				filterButton.panel.setFilterWidth();
		}
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	
