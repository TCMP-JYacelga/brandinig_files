var objDetailGrid = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/fscFinanceSetupMst/app',
			// appFolder : 'app',
			controllers : ['GCP.controller.PrfMstDetailsEntryController'],
			requires : ['GCP.view.PrfMstDtlsActionBarView',
					'GCP.view.LoanTypeDtlsGridView'],
			launch : function() {
				if (!Ext.isEmpty(recKey)) {
					Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
							? 600000
							: parseInt(requestTimeout,10) * 1000 * 60;
					Ext.Ajax.on('requestexception', function(con, resp, op, e) {
								if (resp.status == 403) {
									// window.location='logoutUser.action';
									location.reload();
								}
							});
					objDetailGrid = Ext.create('GCP.view.LoanTypeDtlsGridView',
							{
								renderTo : 'gridDiv'
							});
					$.unblockUI();
				}
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objDetailGrid)) {
		objDetailGrid.hide();
		objDetailGrid.show();
	}
}
