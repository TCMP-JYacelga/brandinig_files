var objPaymentQueueView = null, prefHandler = null;
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
			appFolder : 'static/scripts/payments/paymentQueue/app',
			requires : ['Ext.ux.gcp.PreferencesHandler','Ext.ux.gcp.GroupView',
					'Ext.ux.gcp.vtypes.CustomVTypes','GCP.view.PaymentQueueSummaryView'],
			controllers : ['GCP.controller.PaymentQueueSummaryController'],
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
				objPaymentQueueView = Ext.create('GCP.view.PaymentQueueSummaryView', {
							renderTo : 'paymentQueueDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objPaymentQueueView)) {
		objPaymentQueueView.hide();
		objPaymentQueueView.show();
	}
}