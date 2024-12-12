var objDetailGrid = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/fxSpreadMst/app',
			//appFolder : 'app',
			controllers : ['GCP.controller.FxSpreadPrfController'],
			requires : ['GCP.view.FxSpreadPrfEntryGridView'],
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
				objDetailGrid = Ext.create('GCP.view.FxSpreadPrfEntryGridView', {
							renderTo : 'gridDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objDetailGrid)) {
		objDetailGrid.hide();
		objDetailGrid.show();
	}
}