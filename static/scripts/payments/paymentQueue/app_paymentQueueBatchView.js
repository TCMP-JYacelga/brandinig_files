var objPaymentQueueView = null, prefHandler = null, objActionResult = null;
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
			requires : ['Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.vtypes.CustomVTypes',
					'GCP.view.PaymentQueueGridView'],
			controllers : ['GCP.controller.BatchViewController'],
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
				objPaymentQueueView = Ext.create(
						'GCP.view.PaymentQueueGridView', {
							itemId : 'paymentQueueInstrumentGrid',
							renderTo : 'gridDiv'
						});
				objActionResult = Ext.create(
						'GCP.view.PaymentQueueActionResult', {
							itemId : 'actionResult',
							maxHeight : 160,
							autoHeight : true,
							hidden : true,
							margin : '10 0 12 0',
							renderTo : 'actionResultDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objPaymentQueueView)) {
		objPaymentQueueView.hide();
		objPaymentQueueView.show();
	}
	if (!Ext.isEmpty(objPaymentQueueView)) {
		if (objPaymentQueueView.isVisible()) {
			objPaymentQueueView.hide();
			objPaymentQueueView.show();
		}
	}
}