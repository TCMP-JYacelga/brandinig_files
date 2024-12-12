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
			appFolder : 'static/scripts/commonmst/userCategory/app',
			// appFolder : 'app',
			requires : [ 'Ext.window.MessageBox'],
			controllers : ['SelectPopupController','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {

			}
		});

function getBrAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchbralerts', module);
}

function getBrAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}

function getBrReportPopup(module) {
	GCP.getApplication().fireEvent('fetchbrreports', module);
}
