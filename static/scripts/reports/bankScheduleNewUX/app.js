var objBankScheduleNewUXView = null;
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
			appFolder : 'static/scripts/reports/bankScheduleNewUX/app',
			requires : ['Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.GroupView', 'GCP.view.BankScheduleView'],
			controllers : ['GCP.controller.BankScheduleController'],
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
				objBankScheduleNewUXView = Ext.create('GCP.view.BankScheduleView', {
							renderTo : 'bankScheduleNewUXDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objBankScheduleNewUXView)) {
		objBankScheduleNewUXView.hide();
		objBankScheduleNewUXView.show();
	}
}
