var objProfileView = null;
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
	appFolder : 'static/scripts/utils/eodCenter/app',
	//appFolder : 'app',
	requires : ['GCP.view.EODCenterView'],
	controllers : ['GCP.controller.EODCenterController'],
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
		objProfileView = Ext.create('GCP.view.EODCenterView', {
					renderTo : 'eodCenterDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
