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
			requires : ['GCP.view.FSCPriviligesPopup','Ext.ux.gcp.FilterPopUpView',  'Ext.window.MessageBox'],
			controllers : ['SelectPopupController'],
			launch : function() {

			}
		});

function getFSCAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchfscalerts', module);
}

function getFSCReportPopup(module) {
	GCP.getApplication().fireEvent('fetchfscreports', module);
}
function getSCMProducts(module) {
	GCP.getApplication().fireEvent('showcategoryscmproducts', module);
}