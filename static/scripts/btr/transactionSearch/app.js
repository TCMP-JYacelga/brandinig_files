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
			appFolder : 'static/scripts/btr/transactionSearch/app',
			requires : ['GCP.view.tranSearchSummaryView','Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.tranSearchController'],
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
				objSummaryView = Ext.create('GCP.view.tranSearchSummaryView', {
							renderTo : 'summaryDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objSummaryView)) {
		objSummaryView.hide();
		objSummaryView.show();
	}
}
