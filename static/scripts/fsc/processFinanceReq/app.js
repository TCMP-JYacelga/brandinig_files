var objProcessFinReqView = null, prefHandler = null;
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
			appFolder : 'static/scripts/fsc/processFinanceReq/app',
			requires : ['GCP.view.ProcessFinanceRequestView','Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.ProcessFinanceRequestController'],
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
				objProcessFinReqView = Ext.create('GCP.view.ProcessFinanceRequestView', {
							renderTo : 'processFinReqeDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProcessFinReqView)) {
		objProcessFinReqView.hide();
		objProcessFinReqView.show();
	}
}
