var objInterestRateAppDtlView = null, prefHandler = null;
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
			appFolder : 'static/scripts/fsc/InterestRateDtlApplication/app',
			requires : ['GCP.view.InterestRateApplicationDtlView','Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.InterestRateAppDtlController'],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
			},
			launch : function() {

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								location.reload();
							}
						});
				objInterestRateAppDtlView = Ext.create('GCP.view.InterestRateApplicationDtlView', {
							renderTo : 'interestRateGridDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objInterestRateAppDtlView)) {
		objInterestRateAppDtlView.hide();
		objInterestRateAppDtlView.show();
	}
}
