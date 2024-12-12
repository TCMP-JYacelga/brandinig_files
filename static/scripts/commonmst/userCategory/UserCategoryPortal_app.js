var objbankReportsGridView = null;
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
			requires : ['GCP.view.SubsidiarySelectPopup','Ext.ux.gcp.FilterPopUpView',
					'Ext.window.MessageBox'],
			controllers : ['SubsidiaryController', 
					'SelectPopupController'],
			launch : function() {
			}
		});


function getshowAccounts(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}