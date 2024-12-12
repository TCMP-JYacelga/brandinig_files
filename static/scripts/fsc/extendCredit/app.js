var objExtendCreditView = null, prefHandler = null;
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
			appFolder : 'static/scripts/fsc/extendCredit/app',
			requires : ['GCP.view.ExtendCreditView','Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.ExtendCreditController'],
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
				objExtendCreditView = Ext.create('GCP.view.ExtendCreditView', {
							renderTo : 'extendCreditDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProcessFinReqView)) {
		objExtendCreditView.hide();
		objExtendCreditView.show();
	}
}
