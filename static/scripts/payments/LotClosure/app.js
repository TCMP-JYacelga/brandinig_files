var objLotClosureView = null, prefHandler = null;
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
			appFolder : 'static/scripts/payments/LotClosure/app',
			requires : [ 'Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.vtypes.CustomVTypes',
					'GCP.view.LotClosureSummaryView' ],
			controllers : [ 'GCP.controller.LotClosureSummaryController' ],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				objLotClosureView = Ext.create('GCP.view.LotClosureSummaryView',
						{
							renderTo : 'LotClosureDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objLotClosureView)) {
		objLotClosureView.hide();
		objLotClosureView.show();
	}
}