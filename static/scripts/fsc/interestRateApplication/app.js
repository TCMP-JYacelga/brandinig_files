var objInterestRateView = null, prefHandler = null;
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
			appFolder : 'static/scripts/fsc/interestRateApplication/app',
			requires : ['GCP.view.InterestRateApplicationView','Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.InterestRateApplicationController'],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
			},
			launch : function() {
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								location.reload();
							}
						});
				objInterestRateView = Ext.create('GCP.view.InterestRateApplicationView', {
							renderTo : 'interestRateDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objInterestRateView)) {
		objInterestRateView.hide();
		objInterestRateView.show();
	}
}
