var objBTRSearchTransactionView = null, prefHandler = null;
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
			appFolder : 'static/scripts/btr/btrSearchTransaction/app',
//			appFolder : 'app',
			requires : ['GCP.view.SearchTransactionView'],
			controllers : ['GCP.controller.SearchTransactionController'],
			init : function(application) {
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

				objBTRSearchTransactionView = Ext.create(
						'GCP.view.SearchTransactionView', {
							renderTo : 'searchTransactionDiv'
						});
			}
		});

function resizeContentPanel() {
	if (!Ext.isEmpty(objBTRSearchTransactionView)) {
		objBTRSearchTransactionView.hide();
		objBTRSearchTransactionView.show();
	}
}
