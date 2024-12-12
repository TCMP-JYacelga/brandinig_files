var objWHTRefundView = null, prefHandler = null;
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/payments/WHTRefund/app',
			requires : [ 'Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.vtypes.CustomVTypes',
					'GCP.view.WHTRefundSummaryView' ],
			controllers : [ 'GCP.controller.WHTRefundSummaryController' ],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				objWHTRefundView = Ext.create('GCP.view.WHTRefundSummaryView',
						{
							renderTo : 'WHTRefundDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objWHTRefundView)) {
		objWHTRefundView.hide();
		objWHTRefundView.show();
	}
}