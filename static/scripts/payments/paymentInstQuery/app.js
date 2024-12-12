var objpaymentInstQueryView = null, prefHandler = null;
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
	appFolder : 'static/scripts/payments/paymentInstQuery/app',
	requires : [ 'Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.vtypes.CustomVTypes', 'GCP.view.PaymentInstQuerySummaryView' ],
	controllers : [ 'GCP.controller.PaymentInstQuerySummaryController' ],
	init : function(application) {
		Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
		prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		prefHandler.init(application);
	},
	launch : function() {
		Ext.Ajax.timeout = Ext.isEmpty(requestTimeout) ? 600000 : parseInt(requestTimeout, 10) * 1000 * 60;
		Ext.Ajax.on('requestexception', function(con, resp, op, e) {
			if (resp.status == 403) {
				location.reload();
			}
		});
		objpaymentInstQueryView = Ext.create('GCP.view.PaymentInstQuerySummaryView', {
			renderTo : 'paymentInstQueryDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objpaymentInstQueryView)) {
		objpaymentInstQueryView.hide();
		objpaymentInstQueryView.show();
	}
}